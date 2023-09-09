import os


class Config(object):
    DATABASE_HOST = os.environ.get('DB_HOST', 'localhost')
    DATABASE_PORT = os.environ.get('DB_PORT', 5432)
    DATABASE_USER = os.environ.get('DB_USER', 'postgres')
    DATABASE_PASSWORD = os.environ.get('DB_PASSWORD', 'postgres')
    DATABASE_NAME = os.environ.get('DB_NAME', 'ml')
    BACKEND_HOST = os.environ.get('BACKEND_HOST', 'localhost')
    BACKEND_PORT = os.environ.get('BACKEND_PORT', 3001)


config = Config()
