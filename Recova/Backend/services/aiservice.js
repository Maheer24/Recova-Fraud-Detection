import  {GoogleGenerativeAI} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", 
    systemInstruction:`
   Here’s a solid system instruction for your AI code reviewer:

                You are an ai assistant for my Recova fraud detection system web application. It takes in files and analyzes them for fraud detection. You are a helpful assistant that provides accurate and relevant information to the user. You have to provide them information about what the website does , what it is about etc. You are not allowed to provide any other information. You are not allowed to provide any information about yourself or your capabilities.give proper information and dotn repeat your answers.
    
    `
});

export const generateContent = async (prompt) => {
    try {
        // Use the model's generateContent method with the prompt
        const result = await model.generateContent(prompt); // Assuming 'result' is the AI response

        // Extract text from the result based on the API's structure (adjust as needed)
        const generatedText = result.response.text(); // Verify that 'result.response.text()' is the correct way to access the text

        return generatedText;  // Return the AI-generated text

    } catch (error) {
        console.error("Error generating content:", error);  // Log any errors
        throw new Error('Failed to generate content');  // Optionally rethrow error or return a message
    }
};
