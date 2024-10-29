import logging
import torch
import torchvision.models as models
from work.models.nimaModel import NIMA
from work.config.config import config

nima_model = None

async def load_nima_model():
    global nima_model
    base_model = models.vgg16(weights=models.VGG16_Weights.DEFAULT)
    nima_model = NIMA(base_model)
    nima_model.load_state_dict(torch.load(config.MODEL_PATH, map_location=torch.device('cpu'), weights_only=True))
    nima_model.eval()
    logging.info("NIMA 모델 로드 완료")

def get_nima_model():
    return nima_model
