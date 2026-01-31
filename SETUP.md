# Setup Guide - POS Report Generator Chatbot

## Overview

This guide walks you through setting up and running the AI-powered POS Report Generator Chatbot on Cloudflare.

## Architecture Summary

```
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare Pages                          │
│                   (Frontend - React/JS)                      │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ HTTPS
                  ▼
┌─────────────────────────────────────────────────────────────┐
│               Cloudflare Workers                             │
│         (Main API & Orchestration)                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  /api/chat    - Chat endpoint                        │   │
│  │  /api/report  - Report generation                    │   │
│  └──────────────────────────────────────────────────────┘   │
└──┬──────────────┬───────────────┬──────────────┬────────────┘
   │              │               │              │
   ▼              ▼               ▼              ▼
┌────────┐  ┌─────────┐  ┌──────────────┐  ┌───────┐
│Workers │  │Durable  │  │  Workers AI  │  │  KV   │
│  AI    │  │Objects  │  │ (Llama 3.3)  │  │ Cache │
│        │  │         │  │              │  │       │
└────────┘  └─────────┘  └──────────────┘  └───────┘
```

## Prerequisites

### System Requirements
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher (or yarn)
- macOS, Linux, or Windows

### Cloudflare Account
1. Sign up at [cloudflare.com](https://cloudflare.com)
2. Verify your email
3. Create a Cloudflare account
4. Note your Account ID (found in dashboard)

### Local Development Tools
```bash
# Install Wrangler CLI globally
npm install -g wrangler
```

## Step-by-Step Setup

### 1. Authentication

First, authenticate with Cloudflare:

```bash
wrangler login
```

This will open a browser window to authorize access to your Cloudflare account. After approval, you'll be authenticated locally.

Verify authentication:
```bash
wrangler whoami
```

### 2. Install Dependencies

```bash
cd /path/to/cf_ai_pos_report_generator_chatbot
npm install
```

### 3. Configure wrangler.toml

Update your `wrangler.toml` with your Cloudflare Account ID:

```toml
name = "cf-ai-pos-report-generator-chatbot"
account_id = "your-account-id-here"
```

### 4. Set Up Environment Variables

Create `.dev.vars` for local development:

```bash
cat > .dev.vars << EOF
ACCOUNT_ID=your-account-id
DATABASE_ID=your-database-id
EOF
```

### 5. Local Development

Start the local development server:

```bash
npm run dev
```

This will start:
- Worker on `http://localhost:8788`
- Pages preview on `http://localhost:8787`

Test the API:
```bash
curl -X POST http://localhost:8788/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Generate a daily sales report"}'
```

### 6. Enable Cloudflare Services

#### Enable Workers AI
1. Go to Cloudflare Dashboard
2. Select your account
3. Navigate to Workers & Pages → AI
4. Enable Workers AI (if not already enabled)

#### Create Durable Objects
```bash
# This will be handled by wrangler.toml configuration
# Run this to migrate:
wrangler migrations create add_chat_session_do
```

#### Create KV Namespace
```bash
# Create namespace for caching reports
wrangler kv:namespace create "REPORTS_CACHE"
wrangler kv:namespace create "REPORTS_CACHE" --preview
```

### 7. Deploy to Cloudflare

#### Deploy Worker
```bash
npm run deploy
```

You'll see:
```
✨ Your worker is published at:
https://cf-ai-pos-report-generator-chatbot.your-account.workers.dev
```

#### Deploy Frontend to Pages
```bash
wrangler pages deploy frontend/
```

Follow the prompts to create a new Pages project.

### 8. Access Your Application

- **Worker API**: `https://cf-ai-pos-report-generator-chatbot.your-account.workers.dev`
- **Pages Frontend**: `https://your-pages-project.pages.dev`

## Testing

### 1. Test the Chat API

```bash
curl -X POST https://your-worker.workers.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What were my top 5 products today?",
    "sessionId": "test-session-1"
  }'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "response": "Based on the POS data...",
    "sessionId": "test-session-1",
    "reportId": "report-123456"
  },
  "timestamp": "2026-01-30T12:00:00Z"
}
```

### 2. Test the Report API

```bash
curl -X POST https://your-worker.workers.dev/api/report \
  -H "Content-Type: application/json" \
  -d '{
    "reportType": "daily",
    "filters": {
      "startDate": "2026-01-30",
      "endDate": "2026-01-30"
    },
    "sessionId": "test-session-1"
  }'
```

### 3. Test with Frontend

1. Open the Pages URL in your browser
2. Try the quick report buttons
3. Type a message in the chat box
4. Check responses appear correctly

## Common Issues

### Issue: "401 Unauthorized" from Cloudflare
**Solution:**
```bash
wrangler logout
wrangler login
```

### Issue: Workers AI not responding
**Solution:**
1. Verify Workers AI is enabled in Cloudflare Dashboard
2. Check if you have credits/quota available
3. Ensure AI binding in `wrangler.toml` is correct

### Issue: Durable Objects not working
**Solution:**
```bash
# Ensure DO is bound in wrangler.toml:
[[durable_objects.bindings]]
name = "CHAT_SESSION"
class_name = "ChatSession"

# Run migration
wrangler migrations create add_do
```

### Issue: CORS errors on frontend
**Solution:**
The Worker already handles CORS. Ensure requests from Pages use the correct Worker URL.

## Performance Optimization

### For Production

1. **Enable Caching**:
```toml
[env.production]
routes = [
  { pattern = "your-domain.com/api/*", zone_name = "your-domain.com" }
]
```

2. **Rate Limiting**:
Configure in Cloudflare Dashboard → Security → Rate Limiting

3. **Analytics**:
Enable in Dashboard → Analytics

### Monitoring

View logs:
```bash
wrangler tail
```

## Scaling Considerations

### Users
- Workers scales automatically per region
- Durable Objects: 1 instance per session

### Data Volume
- KV: Up to 25GB per account
- Database can be added for larger datasets

### Rate Limits
- Workers AI: Check quota in Dashboard
- Durable Objects: Check pricing

## Costs

### Estimated Monthly Costs (Free Tier)

| Service | Free Tier | Notes |
|---------|-----------|-------|
| Workers | 100,000 requests/day | $0.50/million after |
| AI | 10,000 requests/month | Pay per million after |
| KV | 100,000 read/write/delete | $0.50 per million after |
| Pages | Unlimited | Free tier |
| Durable Objects | N/A | Pay per request + storage |

## Next Steps

1. **Customize Prompts**: Edit `src/utils/prompts.ts`
2. **Connect Real Data**: Replace sample data in `src/utils/posData.ts`
3. **Add Authentication**: Implement user login
4. **Deploy Frontend**: Use custom domain with Pages
5. **Monitor Analytics**: Set up alerts for errors

## Documentation

- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Workers AI](https://developers.cloudflare.com/workers-ai/)
- [Durable Objects](https://developers.cloudflare.com/durable-objects/)
- [Pages](https://developers.cloudflare.com/pages/)
- [Wrangler CLI](https://developers.cloudflare.com/wrangler/)

## Support

For issues:
1. Check [PROMPTS.md](./PROMPTS.md) for prompt examples
2. Review Cloudflare documentation
3. Check `wrangler tail` for error logs
4. Test endpoints with curl before debugging frontend

## Troubleshooting Commands

```bash
# Check Wrangler version
wrangler --version

# Check authentication
wrangler whoami

# List projects
wrangler projects list

# View logs
wrangler tail

# Publish with verbose output
wrangler publish --verbose

# Test locally with debug
DEBUG=* wrangler dev --local
```

---

**Happy developing!** 🚀

For questions or issues, refer to [PROMPTS.md](./PROMPTS.md) and Cloudflare's official documentation.
