import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ status: "error", message: "Method not allowed" });
  }
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res
      .status(401)
      .json({ status: "error", message: "Yetkilendirme başarısız" });
  }

  try {
    const { userText, aiText } = req.body;

    const conversation = await prisma["conversation"].create({
      data: {
        user: {
          connect: {
            id: session.user.id,
          },
        },
        userInput: userText,
        assistantResponse: aiText,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Conversation ekleme işlemi başarılı.",
      conversation: conversation,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: error.message || "Sunucu Hatası" });
  }
}
