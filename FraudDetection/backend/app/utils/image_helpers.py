import base64
from io import BytesIO
import plotly.io as pio
import json
import pandas as pd
import numpy as np
from ..db.supabase_client import supabase

from reportlab.platypus import Image, Spacer

def decode_base64_image(img_str: str) -> bytes:
    """
    Safely decode a base64 image string.
    Handles optional data URI prefix and fixes missing padding.
    """
    if img_str.startswith("data:image"):
        img_str = img_str.split(",", 1)[1]  # Split only on first comma
    missing_padding = len(img_str) % 4
    if missing_padding:
        img_str += "=" * (4 - missing_padding)
    return base64.b64decode(img_str)


def plotly_to_png(chart_input, width=700, height=400) -> BytesIO:
    """
    Convert a Plotly chart to PNG BytesIO.
    Accepts either a JSON string or a Python dict (from fig.to_dict()).
    """
    # If input is dict, convert to JSON string
    if isinstance(chart_input, dict):
        chart_json_str = json.dumps(chart_input)
    elif isinstance(chart_input, str):
        chart_json_str = chart_input
    else:
        raise ValueError("chart_input must be a dict or JSON string")

    fig = pio.from_json(chart_json_str)
    try:
        img_bytes = pio.to_image(fig, format="png", width=width, height=height)
    except ValueError as exc:
        if "kaleido" in str(exc).lower():
            raise RuntimeError(
                "Plotly image export requires the 'kaleido' package. "
                "Install it with: pip install kaleido"
            ) from exc
        raise
    return BytesIO(img_bytes)


def add_image_to_pdf(elements: list, img_bytes: BytesIO, width: int = 500, height: int = 300, spacer: int = 20):
    """
    Append an image and a spacer to a ReportLab elements list.
    Accepts a BytesIO object or raw bytes.
    """
    if isinstance(img_bytes, bytes):
        img_bytes = BytesIO(img_bytes)

    elements.append(Image(img_bytes, width=width, height=height))
    elements.append(Spacer(1, spacer))


def sanitize_plotly_fig(fig_dict: dict) -> dict:
    """
    Fix Plotly figure dicts where 'values' may be dicts (invalid for Python Plotly).
    """
    if "data" in fig_dict:
        for trace in fig_dict["data"]:
            if "values" in trace and isinstance(trace["values"], dict):
                val_dict = trace["values"]

                if "bdata" in val_dict:
                    decoded = base64.b64decode(val_dict["bdata"])

                    dtype_map = {
                        "i1": np.int8,
                        "i2": np.int16,
                        "i4": np.int32,
                        "f4": np.float32,
                        "f8": np.float64,
                    }

                    dtype = dtype_map.get(val_dict.get("dtype"), np.float64)

                    arr = np.frombuffer(decoded, dtype=dtype)
                    trace["values"] = arr.tolist()
                # Replace with zeros of the same length as labels
    #             trace["values"] = [0] * len(trace.get("labels", []))
    return fig_dict


def fetch_transactions(filename: str) -> pd.DataFrame:
    """
    Fetch transactions from Supabase and return as DataFrame.
    """
    response = supabase.table("Transactions").select("*").eq("uploaded_file", filename).execute()
    df = pd.DataFrame(response.data)
    if df.empty:
        raise ValueError("No data found for this file")
    return df