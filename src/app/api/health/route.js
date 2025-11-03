import { NextResponse } from "next/server";
import { getEnv } from "../../../lib/env.js";

export const runtime = "nodejs";

export async function GET() {
  try {
    const env = getEnv();
    return NextResponse.json({ ok: true, have: Object.keys(env) });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
