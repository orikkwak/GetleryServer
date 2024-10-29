import time
import torch
import torchvision.transforms as transforms
from PIL import Image
from work.controllers.model_loader import get_nima_model
from work.controllers.cache import cache
from work.config.config import config
import logging

# 이미지 전처리 변환 설정
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def process_image(image):
    """이미지를 처리하고 NIMA 점수를 계산하여 반환하는 함수"""
    
    # NIMA 모델 가져오기
    nima_model = get_nima_model()
    if nima_model is None:
        logging.error("NIMA 모델이 로드되지 않았습니다.")
        return {'error': 'NIMA 모델이 로드되지 않았습니다.'}, 500

    # 이미지 파일을 PIL 이미지로 변환 및 RGB 모드로 설정
    pil_image = Image.open(image).convert('RGB')

    # 처리 시작 시간 기록
    start_time = time.time()

    # 이미지 전처리 (텐서 변환 및 정규화)
    image_tensor = transform(pil_image).unsqueeze(0)
    with torch.no_grad():
        output = nima_model(image_tensor)
        nima_score = output.mean().item()

    # 처리 완료 시간 및 경과 시간 계산
    process_time = time.time() - start_time
    logging.info(f"Processing time for {image.filename}: {process_time:.4f}s")

    # 결과 캐싱
    cache[image.filename] = nima_score
    return nima_score
