# MCP (Model Context Protocol) Setup Guide

## Initial Setup

1. **Copy the example configuration:**
   ```bash
   cp .mcp.json.example .mcp.json
   ```

2. **Update .mcp.json with your actual tokens:**
   - `YOUR_SUPABASE_PROJECT_REF`: Get from Supabase dashboard → Settings → General
   - `SUPABASE_ACCESS_TOKEN`: Get from Supabase dashboard → Account → Access Tokens
   - `GITHUB_PERSONAL_ACCESS_TOKEN`: Create at github.com → Settings → Developer settings → Personal access tokens
   - `VERCEL_TOKEN`: Get from vercel.com → Account Settings → Tokens
   - `CONTEXT7_API_KEY`: Get from your Context7 account (if using)

## Security Notes

- ⚠️ **NEVER commit .mcp.json to version control** - it's gitignored for safety
- ✅ Use .mcp.json.example as a template for team members
- ✅ Create tokens with minimal required permissions
- ✅ Rotate tokens regularly

## Token Permission Guidelines

### GitHub Token
Minimum permissions needed:
- `repo` (for private repos) or `public_repo` (for public)
- `read:user`
- `read:org` (if working with org repos)

### Supabase Access Token
- Create a dedicated access token for MCP
- Don't use your main account token

### Vercel Token
- Scope to specific projects if possible
- Use read-only permissions where applicable

## Troubleshooting

If MCP servers fail to connect:
1. Check token validity
2. Ensure all required npm packages are installed
3. Try running individual MCP servers in debug mode
4. Check Claude's MCP logs for specific errors

## Team Collaboration

When sharing with team:
1. Share tokens via secure password manager
2. Each developer maintains their own .mcp.json
3. Never share tokens via chat/email/commits