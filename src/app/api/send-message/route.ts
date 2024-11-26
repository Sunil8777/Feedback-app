import dbConnect from "@/lib/dbConnect";
import Usermodel, { Message } from "@/model/User.model";
 
export async function POST(request:Request) {
    await dbConnect();

    const {username,content} = await request.json();

    try {
        const user =  await Usermodel.findOne({username})

        if(!user){
            return Response.json(
                {
                    success: false,
                    message: 'user not found',
                },
                { status: 404 },
            );
        }

        if(!user.isAcceptingMessage){
            return Response.json(
                {
                    success: false,
                    message: 'user is not accepting the messages',
                },
                { status: 403 },
            );
        }

        const newMessage = {content,createdAt: new Date()};
        user.messages.push(newMessage as Message)

        return Response.json(
            {
                success: true,
                message: 'Message sent successfully',
            },
            { status: 200 },
        );
    } catch (error) {
        console.error('An unexpected error occur',error);
        return Response.json(
            {
                success: false,
                message: 'An unexpected error occur',
            },
            { status: 500 },
        );
    }
}