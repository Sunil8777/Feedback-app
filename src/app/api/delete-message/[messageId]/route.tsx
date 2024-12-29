import dbConnect from "@/lib/dbConnect";
import { auth } from "../../auth/[...nextauth]/options";
import Usermodel from "@/model/User.model";

export async function DELETE(request: Request) {
  await dbConnect();

  const session = await auth();
  if (!session) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }
  const user = session?.user;
  const url = new URL(request.url);
  const messageId = url.pathname.split("/").pop();
  console.log(messageId);
  try {
    const result = await Usermodel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    return Response.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    return Response.json({
        success: false,
        message: "Error on deleting message",
    });
  }
}
