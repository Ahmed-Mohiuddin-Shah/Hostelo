import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json({ ok: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // With the file data in the buffer, you can do whatever you want with it.
  // For this, we'll just write it to the filesystem in a new location
  const uniqueImageName = `${Date.now()}-${file.name}`;
  const path = join(
    process.cwd(),
    "public",
    "images",
    "uploads",
    uniqueImageName
  );
  await writeFile(path, buffer);
  console.log(`open ${path} to see the uploaded file`);

  return NextResponse.json({ ok: true, path });
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ ok: true });
}

export { POST };
