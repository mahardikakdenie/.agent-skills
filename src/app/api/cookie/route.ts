import {NextResponse} from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    const { name, value, days } = body;
    const maxAge = 60 * 60 * 24 * days;

    if (!name || !value) {
        return NextResponse.json(
            { error: "Name and value are required to set a cookie" },
            { status: 400 }
        );
    }

    const response = NextResponse.json({ message: `Cookie ${name} set` });
    const isSecure = req.headers.get("x-forwarded-proto") === "https";
    response.cookies.set(name, value, {
        httpOnly: true,
        secure: isSecure,
        sameSite: "strict",
        maxAge: maxAge,
        path: "/"
    });

    return response;
}