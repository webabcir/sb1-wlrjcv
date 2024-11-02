import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const customer = await prisma.customer.findUnique({
      where: { id: params.id },
    });

    if (!customer) {
      return new NextResponse("Customer not found", { status: 404 });
    }

    if (
      session.user.role !== "ADMIN" &&
      customer.assignedUserId !== session.user.id
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await request.json();
    const updatedCustomer = await prisma.customer.update({
      where: { id: params.id },
      data: body,
    });

    // Log the activity
    await prisma.activity.create({
      data: {
        type: "CUSTOMER_UPDATE",
        description: "Customer information updated",
        userId: session.user.id,
        customerId: params.id,
      },
    });

    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error("Error updating customer:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}