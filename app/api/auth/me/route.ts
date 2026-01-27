import { cookies } from "next/headers"
import { getSessionCookie } from "@/features/auth/services/session"
import { getCurrentUser } from "@/features/user/services/user"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("session_token")?.value
        
        if (!token) {
            return NextResponse.json({ user: null })
        }

        const session = await getSessionCookie(token)
        
        if (!session) {
            return NextResponse.json({ user: null })
        }

        const user = await getCurrentUser()
        
        if (!user) {
            return NextResponse.json({ user: null })
        }

        return NextResponse.json({ user })
    } catch (error) {
        console.error("Error getting current user:", error)
        return NextResponse.json({ user: null })
    }
}
