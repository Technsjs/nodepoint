# NodePoint Environment Variables

## Required for Vercel Deployment

Add these environment variables in your Vercel project settings:

### Telegram Notifications
```
TELEGRAM_BOT_TOKEN=6416350560:AAFvBZ6jJ7OHlBTRsbAPkuIF31-dFDW-ueM
TELEGRAM_CHAT_ID=5711350424
```

### Crypto Payment Addresses
```
NEXT_PUBLIC_ETH_ADDRESS=0x742d35Cc6634C0532925a3b844Bc454e4438f44e
NEXT_PUBLIC_BTC_ADDRESS=bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
NEXT_PUBLIC_SOL_ADDRESS=H6AR6n5n4Z5Pq5u5u5u5u5u5u5u5u5u5u5u5u5u5
NEXT_PUBLIC_USDT_ERC20_ADDRESS=0x742d35Cc6634C0532925a3b844Bc454e4438f44e
NEXT_PUBLIC_USDT_TRC20_ADDRESS=TR7NHqscv2ba2T6GWcuv5J432vv1324
```

## How to Add in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable above with its corresponding value
4. Make sure to add them for **Production**, **Preview**, and **Development** environments
5. Redeploy your application

## Security Notes

- ⚠️ **TELEGRAM_BOT_TOKEN** and **TELEGRAM_CHAT_ID** are server-side only (no `NEXT_PUBLIC_` prefix)
- ✅ Wallet addresses use `NEXT_PUBLIC_` prefix because they're displayed to users
- 🔒 Never commit `.env.local` to git (already in .gitignore)
