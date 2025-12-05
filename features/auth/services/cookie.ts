import { NextResponse } from "next/server";

export function setSessionCookie<T>(response: NextResponse<T>, token: string): NextResponse<T> {
    response.cookies.set({
        name: "session_token",
        value: token,
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });
    return response;
}
