import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function POST(request: Request) {
    try {
        const google = createGoogleGenerativeAI({
            apiKey: process.env.GOOGLE_API_KEY,
        });
        const prompt = `
        Create a list of three open-ended and engaging questions formatted as a single string.
        Each question should be separated by '||'. 
        It should be positive and meaningful. 
        Suggest questions where one person can give feedback to another, like this:
        What's a hobby you've recently started? || 
        If you could have dinner with any historical figure, who would it be? || 
        What's a simple thing that makes you happy?
        make the sentences simple 
        `;
        
        const { text } = await generateText({
            model: google('gemini-1.5-pro-latest'),
            prompt,
        });

        return Response.json(
            {
                success: true,
                message: 'Text is generated',
                text,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error('Error generating text:', error);

        return Response.json(
            {
                success: false,
                message: 'Error generating text',
            },
            { status: 500 },
        );
    }
}
