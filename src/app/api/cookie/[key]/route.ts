import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(_req: Request, { params }: any) {
    const key = params.key;
    const allCookies = cookies();
    const value = (await allCookies).get(key);

    if (!key) return NextResponse.json({ message: "Key cookie not found" }, { status: 404 });
    if (!value) return NextResponse.json({ message: "Cookie not found" }, { status: 404 });

    return NextResponse.json({
        message: "Cookie retrieved successfully!",
        data: value
    });
}

export async function DELETE(req: Request, { params }: any) {
    const key = params.key;

    if (!key) return NextResponse.json({ message: "Key cookie not found" }, { status: 404 });

    const response = NextResponse.json({ message: "Cookie cleared!" }, { status: 200 });
    const isSecure = req.headers.get("x-forwarded-proto") === "https";
    response.cookies.set(key, "", {
        httpOnly: true,
        secure: isSecure,
        maxAge: 0,
        path: "/"
    });

    return response;
}
