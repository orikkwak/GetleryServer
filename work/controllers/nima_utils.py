# nima_utils.py

import logging
import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
from nima.model.model import NIMA  # NIMA 모델 클래스 경로에 맞게 수정

# NIMA 모델 로드 함수
def load_nima_model(model_path):
    base_model = models.vgg16(weights=models.VGG16_Weights.DEFAULT)
    model = NIMA(base_model)
    model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
    model.eval()
    logging.info("NIMA 모델 로드 완료")
    return model

# NIMA 점수 계산 함수
def calculate_nima_score(image_path, model):
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    image = Image.open(image_path).convert('RGB')
    image_tensor = transform(image).unsqueeze(0)
    with torch.no_grad():
        output = model(image_tensor)
        score = torch.mean(output).item()
    return score
