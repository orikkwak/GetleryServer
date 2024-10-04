# getlery-server/models/NimaModel.py

import torch
import torch.nn as nn

class NIMA(nn.Module):
    def __init__(self, base_model):
        super(NIMA, self).__init__()
        self.base_model = base_model
        self.base_model.classifier = nn.Sequential(*list(self.base_model.classifier.children())[:-1])
        self.fc = nn.Linear(4096, 10)
        self.softmax = nn.Softmax(dim=1)

    def forward(self, x):
        x = self.base_model(x)
        x = self.fc(x)
        return self.softmax(x)
