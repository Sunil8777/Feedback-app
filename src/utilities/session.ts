import { Auth } from "@auth/core";
import authOptions from "@/app/api/auth/[...nextauth].js/options";


export async function getSession(request:Request){
    const session = await Auth(request, handler)

    try {
        if(!session){
            return Response.json(
                {
                    success: false,
                    message: "not able to fetch session"
                },
                {status:500}
            )
        }
        return await session.json();
    } catch (error) {
        console.error("not able to fetch session",error);
        return Response.json(
            {
                success: false,
                message: "not able to fetch session"
            },
            {status:500}
        )
    }
} 