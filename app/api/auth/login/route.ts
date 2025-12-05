import { NextRequest, NextResponse } from "next/server";
import { login } from "@/features/auth/services/login";
import { createRateLimiter } from "@/lib/rate-limit";
import { setSessionCookie } from "@/features/auth/services/cookie";
import { RateLimiterRes } from "rate-limiter-flexible";

const limiter = createRateLimiter({
    points: 10,
    duration: 100,
    keyPrefix: "login"
});

export async function POST(req: NextRequest) {
    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";

    try {
        await limiter.consume(ipAddress);

        const { email, password } = await req.json();
        const userAgent = req.headers.get("user-agent") || undefined;

        const { user, session } = await login(email, password, ipAddress, userAgent);

        if (!user) {
            return NextResponse.json({
                success: false,
                error: "Email or password is incorrect"
            }, { status: 400 });
        }

        let response = NextResponse.json({
            success: true,
            user,
            message: "Login successful"
        }, { status: 200 });

        response = setSessionCookie(response, session!.token);

        return response;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {

        if ((err as RateLimiterRes)?.msBeforeNext) {
            const retryAfterSec = Math.ceil((err as RateLimiterRes).msBeforeNext / 1000);
            return NextResponse.json(
                { success: false, error: "Too many requests. Try again later." },
                {
                    status: 429,
                    headers: {
                        "Retry-After": String(retryAfterSec)
                    }
                }
            );
        }

        console.error("Login error:", err);

        return NextResponse.json({
            success: false,
            error: "Internal server error"
        }, { status: 500 });
    }
}
