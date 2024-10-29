import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MODEL_PATH = os.getenv('MODEL_PATH', 'D:/getlery-server/nima/ckpts/epoch-4.pth')
    PORT = int(os.getenv('PORT', 5000))
    MAX_IMAGE_SIZE = (1024, 1024)
    CACHE_MAXSIZE = 100
    CACHE_TTL = 300

config = Config()
