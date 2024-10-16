import os
from pymongo import MongoClient
from dotenv import load_dotenv

class MongoDBClient:
    def __init__(self):
        # Carrega as variáveis de ambiente do arquivo .env
        load_dotenv()

        # Obtém as variáveis do arquivo .env
        username = os.getenv('MONGO_USERNAME')
        password = os.getenv('MONGO_PASSWORD')
        host = os.getenv('MONGO_HOST')
        port = os.getenv('MONGO_PORT')
        database = os.getenv('MONGO_DATABASE')

        # Cria a string de conexão com o MongoDB
        mongo_uri = f'mongodb://{username}:{password}@{host}:{port}/'

        # Conecta ao MongoDB
        self.client = MongoClient(mongo_uri)

        # Acessa o banco de dados especificado
        self.db = self.client[database]

    def get_collection(self, collection_name):
        """Retorna uma coleção específica do MongoDB"""
        return self.db[collection_name]

    def close_connection(self):
        """Fecha a conexão com o MongoDB"""
        self.client.close()
