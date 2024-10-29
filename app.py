import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
import asyncio
from concurrent.futures import ThreadPoolExecutor
from work.controllers.model_loader import load_nima_model
from work.controllers.image_processor import process_image
from work.controllers.cache import cache
from work.config.config import config

app = Flask(__name__)
CORS(app)

asyncio.run(load_nima_model())
executor = ThreadPoolExecutor(max_workers=5)

# /get_nima_score 엔드포인트 정의
@app.route('/get_nima_score', methods=['POST'])
async def get_nima_score():
    if 'images' not in request.files:
        return jsonify({'error': 'No images provided'}), 400

    # getlist 메서드로 이미지 목록 가져오기
    images = request.files.getlist('images')
    nima_scores = {}

    # 비동기 멀티스레딩으로 이미지 처리
    tasks = [executor.submit(process_image, image) for image in images if image.filename not in cache]
    results = await asyncio.gather(*[asyncio.wrap_future(task) for task in tasks])

    for image, nima_score in zip(images, results):
        nima_scores[image.filename] = nima_score

    return jsonify({'nima_scores': nima_scores})

# 서버 실행 코드
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=config.PORT, debug=True)
