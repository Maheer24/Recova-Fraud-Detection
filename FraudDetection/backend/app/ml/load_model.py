import pickle

def load_catboost_model(file_path: str):
    with open(file_path, 'rb') as file:
        model = pickle.load(file)
        return model
