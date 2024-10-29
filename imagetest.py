""" import os
import cv2
import numpy as np
from skimage import io
from skimage.restoration import estimate_sigma
import brisque
from PIL import Image

# 이미지 경로 설정
image1_path = 'C:/Users/Jenog/Pictures/Screenshots/image1.png'
image2_path = 'C:/Users/Jenog/Pictures/Screenshots/image2.png'
image3_path = 'C:/Users/Jenog/Pictures/Screenshots/image3.png'

# 이미지 로드 및 확인
def load_image(image_path):
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if image is None:
        print(f"Error: Unable to load image at {image_path}")
    return image

image1 = load_image(image1_path)
image2 = load_image(image2_path)
image3 = load_image(image3_path)

# 1. OpenCV를 사용한 선명도 측정 (Laplacian)
def compute_sharpness(image):
    if image is None:
        return None
    laplacian_var = cv2.Laplacian(image, cv2.CV_64F).var()
    return laplacian_var

# 2. Tenengrad를 사용한 선명도 평가
def compute_tenengrad(image):
    if image is None:
        return None
    sobelx = cv2.Sobel(image, cv2.CV_64F, 1, 0, ksize=3)
    sobely = cv2.Sobel(image, cv2.CV_64F, 0, 1, ksize=3)
    tenengrad = np.sqrt(sobelx**2 + sobely**2).mean()
    return tenengrad

# 3. BRISQUE 품질 평가
def compute_brisque(image_path):
    try:
        image = Image.open(image_path)
        brisq = brisque.BRISQUE()
        score = brisq.score(image)
        return score
    except Exception as e:
        print(f"Error processing BRISQUE for {image_path}: {e}")
        return None

# 4. 이미지의 노이즈 레벨 평가 (NIQE 기반)
def compute_noise_level(image_path):
    try:
        image = io.imread(image_path)
        sigma_est = estimate_sigma(image, channel_axis=-1, average_sigmas=True)  # 수정된 부분
        return sigma_est
    except Exception as e:
        print(f"Error computing noise level for {image_path}: {e}")
        return None

# 이미지 1에 대한 평가
sharpness1 = compute_sharpness(image1)
tenengrad1 = compute_tenengrad(image1)
brisque_score1 = compute_brisque(image1_path)
noise_level1 = compute_noise_level(image1_path)

print(f"Image 1 - Sharpness (Laplacian): {sharpness1}, Tenengrad: {tenengrad1}, BRISQUE Score: {brisque_score1}, Noise Level: {noise_level1}")

# 이미지 2에 대한 평가
sharpness2 = compute_sharpness(image2)
tenengrad2 = compute_tenengrad(image2)
brisque_score2 = compute_brisque(image2_path)
noise_level2 = compute_noise_level(image2_path)

print(f"Image 2 - Sharpness (Laplacian): {sharpness2}, Tenengrad: {tenengrad2}, BRISQUE Score: {brisque_score2}, Noise Level: {noise_level2}")

# 이미지 3에 대한 평가
sharpness3 = compute_sharpness(image3)
tenengrad3 = compute_tenengrad(image3)
brisque_score3 = compute_brisque(image3_path)
noise_level3 = compute_noise_level(image3_path)

print(f"Image 3 - Sharpness (Laplacian): {sharpness3}, Tenengrad: {tenengrad3}, BRISQUE Score: {brisque_score3}, Noise Level: {noise_level3}")
 """