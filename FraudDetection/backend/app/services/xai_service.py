import shap
import matplotlib.pyplot as plt
import io
import base64

class XAIService:

    def bar_plot(self, shap_values):
        plt.figure()
        plt.title("Global Feature Importance (Bar Plot)")
        shap.plots.bar(shap_values, show=False)
        buffer = io.BytesIO()

        plt.savefig(buffer, format="png", bbox_inches="tight", dpi=150)
        plt.close()

        buffer.seek(0)
        encoded_bytes = base64.b64encode(buffer.read())

        encoded_string = encoded_bytes.decode("utf-8")

        return encoded_string

    def waterfall_plot(self, shap_values, indices):
        encoded_strings_list = []

        indices = list(indices)[:2]

        for i in indices:
            plt.figure()

            shap.plots.waterfall(shap_values[i], show=False)

            buffer = io.BytesIO()
            plt.savefig(buffer, format="png", bbox_inches="tight", dpi=150)
            plt.close()

            buffer.seek(0)

            encoded_bytes = base64.b64encode(buffer.read())
            encoded_strings = encoded_bytes.decode("utf-8")
            encoded_strings_list.append(encoded_strings)

        return encoded_strings_list

        # os.makedirs("images", exist_ok=True)
        # image_path = os.path.join("images", f"{label}_waterfall_chart_{i}.png")
        # plt.savefig(image_path, bbox_inches="tight", dpi=150)
        # plt.close()

    # print(f"Saved SHAP bar plot at: {image_path}")


# if __name__ == "__main__":

#     df = pd.read_excel(TEST_DATA_PATH)

#     model = load_catboost_model(MODEL_PATH)

#     preprocessed_df = preprocess_input_data(df)

#     _, normal_indices, fraud_indices = predict_transaction(model, preprocessed_df)

#     prediction_labels = {"Normal":0, "Fradulent":1}
#     preprocessed_df["Flag"] = preprocessed_df["Flag"].map(prediction_labels)

#     shap_values = compute_shap_val(df=preprocessed_df, model=model)

#     waterfall_plot(shap_values, fraud_indices, "fraud")
