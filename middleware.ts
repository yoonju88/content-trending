import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decodeJwt } from "jose"

export async function middleware(request: NextRequest) {
    // console.log("Middlewaore:", request.url)
    if (request.method === "POST") {
        return NextResponse.next()
    }
    const cookieStore = await cookies()
    const token = cookieStore.get("firebaseAuthToken")?.value

    // 로그인 페이지로 접근하는 경우, 토큰이 없으면 로그인 페이지를 계속 보여준다.
    if (!token &&
        request.nextUrl.pathname.startsWith("/login") ||
        request.nextUrl.pathname.startsWith("/coupang") ||
        request.nextUrl.pathname.startsWith("/always") ||
        request.nextUrl.pathname.startsWith("/naver") ||
        request.nextUrl.pathname.startsWith("/smart-store")
    ) {
        return NextResponse.next()
    }
    //로그인 확인되면 홈페이지로 이동
    if (token && request.nextUrl.pathname.startsWith("/login")) {
        return NextResponse.redirect(new URL("/", request.url))
    }
    // 토큰이 없는 경우, 홈으로 리디렉션
    if (!token) {
        return NextResponse.redirect(new URL("/", request.url))
    }
    // 토큰 디코딩
    const decodedToken = decodeJwt(token)
    // Validate that email exists in the payload
    if (!decodedToken.admin) {
        return NextResponse.redirect(new URL("/", request.url))
    }
    return NextResponse.next()
}

export const config = {
    matcher: ["/always", "/coupang", "/login", "/naver", "/smart-store"],
}