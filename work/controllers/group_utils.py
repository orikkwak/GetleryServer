# work/controllers/group_utils.py

import numpy as np
from PIL import Image
from work.controllers.nima_utils import calculate_nima_score

def select_representative_images(groups, model, num_representatives=1):
    representative_images = []

    for group in groups:
        group_representative_images = []
        scores = []

        for image_path in group:
            score = calculate_nima_score(image_path, model)
            group_representative_images.append((image_path, score))
            scores.append(score)

        # 점수가 동일한 경우 대체 기준 적용
        if len(set(scores)) == 1 or max(scores) - min(scores) < 1e-7:
            coefficients = [np.std(np.array(Image.open(img).convert('L'))) / np.mean(np.array(Image.open(img).convert('L'))) for img, _ in group_representative_images]
            group_representative_images = [x for _, x in sorted(zip(coefficients, group_representative_images))]
        else:
            group_representative_images.sort(key=lambda x: x[1], reverse=True)

        representative_images.extend([img_path for img_path, _ in group_representative_images[:num_representatives]])

    return representative_images
