import { setSessionCookie } from "@/features/auth/services/cookie";
import { createSession } from "@/features/auth/services/session";
import { signUp } from "@/features/auth/services/sign-up";
import { getUserByEmail } from "@/features/auth/services/user";
import { createRateLimiter } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";
import { RateLimiterRes } from "rate-limiter-flexible";

const limiter = createRateLimiter({
    points: 10,
    duration: 100,
    keyPrefix: "signup",
});

export async function POST(req: NextRequest) {
    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";

    try {
        await limiter.consume(ipAddress);

        const { email, password, username, confirmPassword } = await req.json();

        const userAgent = req.headers.get("user-agent") || undefined;

        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return NextResponse.json(
                { success: false, error: "User already exists with this email" },
                { status: 409 }
            );
        }

        const user = await signUp(email, password, username, confirmPassword);

        if (!user || !("id" in user)) {
            return NextResponse.json(
                { success: false, error: "Sign-up failed", details: user?.errors || null },
                { status: 400 }
            );
        }

        const session = await createSession(user.id, ipAddress, userAgent);

        let response = NextResponse.json({
            success: true,
            user,
            message: "User created successfully"
        }, { status: 201 })

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

        console.error("Signup error:", err);

        return NextResponse.json(
            { success: false, error: "Internal server error", details: err.message },
            { status: 500 }
        );
    }
}
