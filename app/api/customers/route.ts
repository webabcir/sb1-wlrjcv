import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const customers = await prisma.customer.findMany({
      where: session.user.role === "ADMIN" 
        ? {} 
        : { assignedUserId: session.user.id },
      orderBy: { lastContact: "desc" },
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}