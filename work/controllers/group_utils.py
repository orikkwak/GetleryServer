# group_utils.py

import numpy as np
from PIL import Image
from work.controllers.nima_utils import calculate_nima_score

# NIMA 점수 계산 함수 임포트

# 대표 이미지 선택 함수
def select_representative_images(similar_groups, model, num_representatives=3):
    representative_images = []

    for i, group in enumerate(similar_groups):
        group_representative_images = []
        scores = []

        for image_path in group:
            score = calculate_nima_score(image_path, model)
            group_representative_images.append((image_path, score))
            scores.append(score)

        if len(set(scores)) == 1 or max(scores) - min(scores) < 0.00000001:
            coefficients = [np.std(np.array(Image.open(img).convert('L'))) / np.mean(np.array(Image.open(img).convert('L'))) for img, _ in group_representative_images]
            group_representative_images = [x for _, x in sorted(zip(coefficients, group_representative_images))]
        else:
            group_representative_images.sort(key=lambda x: x[1], reverse=True)

        representative_images.extend([img_path for img_path, _ in group_representative_images[:num_representatives]])

    return representative_images
