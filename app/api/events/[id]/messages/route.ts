import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const messages = await prisma.message.findMany({
      where: { eventId: id },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();

    const text = body.text || "";
    const userName = body.userName || "Attendee";
    const userHandle = body.userHandle || "@attendee";
    const userAvatar =
      body.userAvatar ||
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100";

    if (!text) {
      return NextResponse.json(
        { error: "Message text is required" },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        eventId: id,
        text,
        userName,
        userHandle,
        userAvatar,
      },
    });

    return NextResponse.json(message);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to post message" },
      { status: 500 }
    );
  }
}