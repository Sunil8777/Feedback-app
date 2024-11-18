import dbConnect from "@/lib/dbConnect";
import Usermodel from "@/model/User.model";

export async function POST(request:Request) {
    await dbConnect()

    try {
        const {username,code} = await request.json();
        const decodeUsername = decodeURIComponent(username);

        const user = await Usermodel.findOne({username:decodeUsername})

        if(!user){
            return Response.json(
                {
                    success: false,
                    message: 'user not found',
                },
                { status: 400 },
            );
        }

        const verifyCode = code === user.verifyCode;
        const notExpiredCode = new Date(user.verifyCodeExpiry) > new Date()

        if(verifyCode && notExpiredCode){
            user.isVerified = true
            user.save()

            return Response.json(
                {
                    success: true,
                    message: 'user verified successfully',
                },
                { status: 200 },
            );
        }else if(!notExpiredCode){

            return Response.json(
                {
                    success: false,
                    message: 'verification code is expired please signup again',
                },
                { status: 400 },
            );
        }else{

            return Response.json(
                {
                    success: false,
                    message: 'Incorrect verification code',
                },
                { status: 400 },
            );
        }
     } catch (error) {
        console.error('Error on verifying user', error);
        return Response.json(
            {
                success: false,
                message: 'Error on verifying user',
            },
            { status: 500 },
        );
    }
}