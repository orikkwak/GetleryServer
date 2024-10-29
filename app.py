import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from concurrent.futures import ThreadPoolExecutor
from work.controllers.nima_utils import load_nima_model, calculate_nima_score
from work.config.config import config
from work.controllers.group_utils import select_representative_images

app = Flask(__name__)
CORS(app)
executor = ThreadPoolExecutor(max_workers=5)
logging.basicConfig(level=logging.INFO)

# NIMA 모델 로드
logging.info("Loading NIMA model...")
nima_model = load_nima_model(config.MODEL_PATH)
logging.info("NIMA model loaded successfully.")

# 개별 이미지 NIMA 점수 계산 API
@app.route('/get_nima_score', methods=['POST'])
def get_nima_score():
    if 'image' not in request.files:
        logging.error("No image provided in the request.")
        return jsonify({'error': 'No image provided'}), 400

    image = request.files['image']
    logging.info(f"Calculating NIMA score for image: {image.filename}")
    score = executor.submit(calculate_nima_score, image, nima_model).result()
    logging.info(f"Calculated NIMA score: {score} for image: {image.filename}")
    return jsonify({'nima_score': score})

# 그룹 대표 이미지 선택 API
@app.route('/select_representative_images', methods=['POST'])
def representative_images():
    data = request.json
    similar_groups = data.get('similar_groups')
    num_representatives = data.get('num_representatives', 3)

    logging.info("Selecting representative images for provided groups.")
    representative_images = select_representative_images(similar_groups, nima_model, num_representatives)
    logging.info(f"Selected representative images: {representative_images}")
    return jsonify({'representative_images': representative_images})

if __name__ == '__main__':
    logging.info("Starting Flask app...")
    app.run(host='0.0.0.0', port=config.PORT, debug=True)
    logging.info("Flask서버 연결되었습니다.")
