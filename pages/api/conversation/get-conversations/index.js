import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export default async function handler(req, res) {
  if (req.method !== "GET") {
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
    // örnek istek: /api/conversation/get-conversations?skip=20&take=20  -> ilk 20 yi atla, sonraki 20 yi çek
    const { skip, take } = req.query;
    console.log("skip: " + skip);
    console.log("take: " + take);

    const conversations = await prisma["conversation"].findMany({
      skip: parseInt(skip),
      take: parseInt(take),

      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Conversationları getirme işlemi başarılı.",
      conversations: conversations,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "error", message: error.message || "Sunucu Hatası" });
  }
}
