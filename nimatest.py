from skimage import io
from skimage.metrics import structural_similarity as ssim
from skimage.transform import resize
import numpy as np

# 이미지 로드
image1 = io.imread("C:/Users/Jenog/Pictures/Screenshots/스크린샷 2024-05-19 223449.png")
image2 = io.imread("C:/Users/Jenog/Pictures/Screenshots/스크린샷 2024-05-19 223509.png")

# 이미지가 다중 채널일 경우, 채널 축을 맞춰줘야 함 (이미지가 RGB일 경우)
if image1.shape != image2.shape:
    image2_resized = resize(image2, image1.shape, anti_aliasing=True)  # image1의 크기로 image2를 맞춤
else:
    image2_resized = image2

# SSIM 계산 (데이터 범위 설정)
quality_score = ssim(image1, image2_resized, win_size=3, multichannel=True, data_range=image1.max() - image1.min())
print(f"Image quality score: {quality_score}")