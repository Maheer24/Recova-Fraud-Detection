from groq import Groq
import os

class LLMService:

    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    def explain(self, prompt: str):
        try:
            response = self.client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {"role": "system", "content": "You are a strict financial explanation assistant."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.5,
            )

            return response.choices[0].message.content

        except Exception as e:
            raise RuntimeError(f"LLM failed: {str(e)}")