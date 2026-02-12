import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

// This endpoint pings Supabase to prevent the free-tier project from
// being paused due to inactivity (pauses after 7 days of no requests).
// Configured to run daily via Vercel Cron (see vercel.json).

export async function GET() {
  try {
    // Simple lightweight query to keep the connection alive
    const { count, error } = await supabase
      .from("personal")
      .select("*", { count: "exact", head: true });

    if (error) {
      return NextResponse.json(
        { status: "error", message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "ok",
      message: "Supabase keep-alive ping successful",
      timestamp: new Date().toISOString(),
      rowCount: count,
    });
  } catch (err) {
    return NextResponse.json(
      { status: "error", message: String(err) },
      { status: 500 }
    );
  }
}
