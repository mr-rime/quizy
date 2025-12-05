import { NextRequest, NextResponse } from "next/server";
import { logout } from "@/features/auth/services/logout";

export async function POST(req: NextRequest) {
    const token = req.cookies.get("session_token")?.value;

    if (!token) {
        return NextResponse.json({ success: false, message: "No session found" }, { status: 400 });
    }

    await logout(token);

    const response = NextResponse.json({ success: true, message: "Logged out successfully" }, { status: 200 });
    response.cookies.delete("session_token");

    return response;
}
