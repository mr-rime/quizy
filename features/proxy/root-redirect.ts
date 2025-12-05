import { NextRequest, NextResponse } from "next/server";

export function handleRootRedirect(req: NextRequest) {
    const url = req.nextUrl.clone();
    if (url.pathname === "/") {
        url.pathname = "/latest";
        return NextResponse.redirect(url);
    }
    return null;
}
