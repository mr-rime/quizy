import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { handleProtectedRoute } from "./features/proxy/protected-routes";
import { handleAuthRedirect } from "./features/proxy/auth-redirects";

export async function proxy(req: NextRequest) {

    const authRedirect = await handleAuthRedirect(req);
    if (authRedirect) return authRedirect;

    const protectedResponse = await handleProtectedRoute(req);
    if (protectedResponse) return protectedResponse;

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/login",
        "/signup",
        "/latest/:path*",
        "/create-set/:path*",
    ],
};
