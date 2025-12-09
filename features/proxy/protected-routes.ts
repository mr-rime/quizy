import { NextRequest, NextResponse } from "next/server";

const protectedPaths = ["/latest"];

export async function handleProtectedRoute(req: NextRequest) {
    const url = req.nextUrl.clone();
    const isProtected = protectedPaths.some((path) =>
        url.pathname.startsWith(path)
    );

    if (!isProtected) return null;

    const token = req.cookies.get("session_token")?.value;

    if (!token) {
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();

    // const session = token ? await getSessionByToken(token) : null;
    // if (!session) {
    //     url.pathname = "/login";
    //     return NextResponse.redirect(url);
    // }
    // const res = NextResponse.next();
    // res.headers.set("x-user-id", session.userId);
    // return res;
}
