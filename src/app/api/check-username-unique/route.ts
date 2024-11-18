import dbConnect from '@/lib/dbConnect';
import { z } from 'zod';
import Usermodel from '@/model/User.model';
import { usernameValidation } from '@/schema/signUpSchema';

const UsernameQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(request: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username'),
        };

        const result = UsernameQuerySchema.safeParse(queryParam);
        if (!result.success) {
            const usernameError = result.error.format().username?._errors || [];
            return Response.json(
                {
                    success: false,
                    message:
                        usernameError.length > 0
                            ? usernameError.join(', ')
                            : 'Invalid query param',
                },
                { status: 400 },
            );
        }

        const {username} = result.data;
        
        const existingUser = await Usermodel.findOne({username,isVerified:true})

        if(existingUser){
             return Response.json(
                {
                    success: false,
                    message: 'Username is already taken',
                },
                { status: 400 },
             )
        }

        return Response.json(
            {
                success: true,
                message: 'Username is unique',
            },
            { status: 200 },
         )
    } catch (error) {
        console.error('Error on checking username', error);
        return Response.json(
            {
                success: false,
                message: 'Error on checking username',
            },
            { status: 500 },
        );
    }
}
