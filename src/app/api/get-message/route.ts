import dbConnect from "@/lib/dbConnect";
import Usermodel from "@/model/User.model";
import { User } from "@/model/User.model";
import mongoose from "mongoose";
import { auth } from "../auth/[...nextauth]/options";

export async function GET() {
  await dbConnect();

  const session = await auth();
  const user: User = session?.user as User; 

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id as string);

  try {
    const user = await Usermodel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: false,
        messages: user[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("error occur in get-message");
    return Response.json(
      {
        success: false,
        message: "error occur in get-message",
      },
      { status: 500 }
    );
  }
}
