from pathlib import Path


# Resolve model path relative to this file so imports work from any cwd.
MODEL_PATH = str(Path(__file__).resolve().parent / "model" / "catboost_model.pkl")