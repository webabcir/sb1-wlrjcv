import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { parse } from "csv-parse";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return new NextResponse("No file uploaded", { status: 400 });
    }

    const text = await file.text();
    const records: any[] = [];

    // Parse CSV
    await new Promise((resolve, reject) => {
      parse(text, {
        columns: true,
        skip_empty_lines: true,
      })
        .on("data", (record) => records.push(record))
        .on("end", resolve)
        .on("error", reject);
    });

    // Process records and save to database
    const customers = await Promise.all(
      records.map(async (record) => {
        return await prisma.customer.create({
          data: {
            userId: record["کارشناس"],
            phone: record["شماره"],
            gender: record["جنسیت"],
            name: record["مشتری"],
            province: record["استان"],
            question: record["سوال"],
            result: record["نتیجه"],
            notes: record["توضیحات"],
            lastContact: record["آخرین تماس"] ? new Date(record["آخرین تماس"]) : null,
            today: record["امروز"] ? new Date(record["امروز"]) : null,
            daysSinceLastContact: parseInt(record["روز گذشته از آخرین تماس"]) || null,
            assignedUserId: session.user.id,
          },
        });
      })
    );

    return NextResponse.json({
      message: "Upload successful",
      count: customers.length,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return new NextResponse("Upload failed", { status: 500 });
  }
}