import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// This endpoint pings Supabase to prevent the free-tier project from
// being paused due to inactivity (pauses after 7 days of no requests).
// Configured to run daily via Vercel Cron (see vercel.json).

export async function GET(request: NextRequest) {
  // Best practice Vercel Cron: verifikasi CRON_SECRET. Bila env CRON_SECRET
  // belum di-set, endpoint tetap terbuka (agar tidak merusak cron yang berjalan)
  // — tapi SETELAH set CRON_SECRET di Vercel, semua request tanpa token ditolak.
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      );
    }
  }

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
