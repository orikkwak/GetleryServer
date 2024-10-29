from cachetools import TTLCache
from work.config.config import config

cache = TTLCache(maxsize=config.CACHE_MAXSIZE, ttl=config.CACHE_TTL)
