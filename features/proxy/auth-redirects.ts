import { NextRequest, NextResponse } from "next/server";
import { getSessionByToken } from "@/features/auth/services/session";

const authPages = ["/login", "/signup"];

export async function handleAuthRedirect(req: NextRequest) {
    const url = req.nextUrl.clone();

    if (!authPages.includes(url.pathname)) return null;

    const token = req.cookies.get("session_token")?.value;
    const session = token ? await getSessionByToken(token) : null;

    if (session) {
        url.pathname = "/latest";
        return NextResponse.redirect(url);
    }

    return null;
}
