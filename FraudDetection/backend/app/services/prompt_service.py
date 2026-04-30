def build_llm_prompt(insights, prediction):
    try:
        text = f"""
        You are a financial fraud explanation assistant.
        Explain why the model predicted: {prediction}

        Rules:
        - Do NOT use bullet points, asterisks (*), or markdown
        - Write in plain sentences only
        - Use ONLY the provided factors
        - Explain in 2–3 simple sentences
        - Make it user friendly
        - If prediction is Fraudulent, explain why it appears Fraudulent
        - Do NOT repeat the phrase "the model predicted"

        Factors:
        """

        for i, f in enumerate(insights, 1):
            text += f"""
                {i}. Feature: {f['feature']}
                Value: {f['value']}
                Status: {f['status']}
                Impact: {f['impact']}
            """

        text += "\nNow explain this prediction clearly."
        return text

    except Exception as e:
        raise RuntimeError(f"Prompt build failed: {str(e)}")