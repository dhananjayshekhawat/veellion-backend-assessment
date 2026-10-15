import { NextResponse } from "next/server";
import { BACKEND_BASE_URL } from "@/lib/constants";

export async function GET() {
  try {
    const response = await fetch(
      `${BACKEND_BASE_URL}/reports/tasks-summary`,
      { cache: "no-store" },
    );

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { error: { message: "Unable to connect to the reports service." } },
      { status: 502 },
    );
  }
}