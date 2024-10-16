import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torchvision.transforms as transforms
import torchvision.models as models
from PIL import Image
from dotenv import load_dotenv
from nima.model.model import NIMA
import numpy as np
import requests

# 환경 변수 로드
load_dotenv()

# 로깅 설정
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Flask 앱 생성 및 CORS 설정
app = Flask(__name__)
CORS(app)

# 모델 로드 및 설정
def load_nima_model():
    try:
        model_path = r"D:\getlery-server\nima\ckpts\epoch-4.pth"  # 가중치 파일 경로 확인
        base_model = models.vgg16(weights=models.VGG16_Weights.DEFAULT)
        nima_model = NIMA(base_model)

        # 가중치만 로드하도록 수정
        nima_model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu'), weights_only=True))
        nima_model.eval()  # 평가 모드로 설정
        logging.info("NIMA 모델 로드 완료")
        return nima_model
    except Exception as e:
        logging.error(f"모델 로드 실패: {e}")
        return None

nima_model = load_nima_model()

# 이미지 전처리 변환 설정
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# 사진 업로드 처리 API
@app.route('/upload', methods=['POST'])
def upload_photos():
    if 'photos' not in request.files:
        return jsonify({'error': 'No photos provided'}), 400

    photos = request.files.getlist('photos')
    saved_files = []

    # 사진 저장 디렉토리 설정
    upload_dir = os.getenv('UPLOAD_DIR', 'uploaded_photos')
    os.makedirs(upload_dir, exist_ok=True)

    for photo in photos:
        # 파일 저장
        file_path = os.path.join(upload_dir, photo.filename)
        photo.save(file_path)
        saved_files.append(file_path)

    return jsonify({'message': 'Photos uploaded successfully', 'files': saved_files})

# 사진 삭제 처리 API
@app.route('/delete', methods=['DELETE'])
def delete_photos():
    data = request.get_json()
    if 'photoId' not in data:
        return jsonify({'error': 'No photoId provided'}), 400

    photo_id = data['photoId']
    photo_path = os.path.join('uploaded_photos', photo_id)

    if os.path.exists(photo_path):
        os.remove(photo_path)
        return jsonify({'message': f'Photo {photo_id} deleted successfully'})
    else:
        return jsonify({'error': 'File not found'}), 404

# NIMA 점수 계산 후 Node.js로 전송하는 함수
def send_nima_score_to_nodejs(photo_id, nima_score):
    url = 'http://localhost:3000/nima/save_nima_score'  # Node.js 서버의 API URL
    data = {
        'photoId': photo_id,
        'nimaScore': nima_score
    }
    response = requests.post(url, json=data)
    if response.status_code == 200:
        logging.info('NIMA 점수 저장 성공')
    else:
        logging.error(f'NIMA 점수 저장 실패: {response.status_code}')

# NIMA 점수 계산 API
@app.route('/get_nima_score', methods=['POST'])
def get_nima_score():
    if 'images' not in request.files:
        return jsonify({'error': 'No images provided'}), 400

    images = request.files.getlist('images')
    nima_scores = {}

    if nima_model is None:
        return jsonify({'error': 'NIMA 모델이 로드되지 않았습니다.'}), 500

    for image in images:
        try:
            pil_image = Image.open(image).convert('RGB')
            logging.info("Image successfully opened and converted.")
        except Exception as e:
            logging.error(f"Error opening image: {e}")
            continue

        # 이미지 변환 및 NIMA 점수 계산
        image_tensor = transform(pil_image).unsqueeze(0)
        with torch.no_grad():
            output = nima_model(image_tensor)
            nima_score = output.mean().item()

        # 결과 저장 (파일명 및 NIMA 점수)
        nima_scores[image.filename] = nima_score

        # NIMA 점수를 Node.js 서버로 전송
        send_nima_score_to_nodejs(image.filename, nima_score)

    return jsonify({'nima_scores': nima_scores})

# 기본 라우트 (서버 상태 확인용)
@app.route('/')
def index():
    return jsonify({'message': 'Welcome to Getlery Server!'})

# 서버 실행
if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
