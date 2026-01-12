import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { email, plan, amount, note, crypto } = await request.json();

        // Telegram credentials from environment variables
        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

        if (BOT_TOKEN && CHAT_ID) {
            let message = `🚀 *New NodePoint Alert!*\n\n📧 Email: ${email}\n📦 Plan: ${plan}\n💰 Amount: ${amount}\n🪙 Asset: ${crypto || "N/A"}`;
            if (note) {
                message += `\n\n📝 *Note:* ${note}`;
            }
            message += `\n\n_System: Processing internal dispatch..._`;

            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                    parse_mode: "Markdown",
                }),
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Telegram notification failed", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
