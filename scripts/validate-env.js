#!/usr/bin/env node

/**
 * SuperSwift Interview Agent - Environment Validation Script
 * Ensures all PRD-required environment variables are properly configured
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// PRD-required environment variables by category
const requiredVars = {
  'Core Application': [
    'NEXT_PUBLIC_APP_URL',
    'NODE_ENV'
  ],
  'Supabase (PRD Database Requirement - MCP Managed)': [
    // Note: Supabase connection managed via MCP (.mcp.json)
    // Only need these for frontend client connection
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ],
  'ElevenLabs Voice API (PRD FR1 - Voice-First Interface)': [
    'ELEVENLABS_API_KEY',
    'ELEVENLABS_VOICE_ID'
  ],
  'N8N Workflows (PRD Backend Hosting Requirement)': [
    'N8N_WEBHOOK_URL',
    'N8N_API_KEY'
  ],
  'AI & Conversation': [
    'OPENAI_API_KEY'
  ]
};

const optionalVars = {
  'Analytics': [
    'NEXT_PUBLIC_POSTHOG_KEY',
    'NEXT_PUBLIC_POSTHOG_HOST'
  ],
  'File Upload': [
    'R2_UPLOAD_IMAGE_ACCESS_KEY_ID',
    'R2_UPLOAD_IMAGE_SECRET_ACCESS_KEY',
    'CLOUDFLARE_ACCOUNT_ID'
  ],
  'Payments': [
    'POLAR_ACCESS_TOKEN',
    'POLAR_WEBHOOK_SECRET'
  ],
  'OAuth': [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET'
  ]
};

function checkMCPSupabase() {
  const mcpPath = path.join(process.cwd(), '.mcp.json');
  
  if (fs.existsSync(mcpPath)) {
    try {
      const mcpConfig = JSON.parse(fs.readFileSync(mcpPath, 'utf8'));
      if (mcpConfig.mcpServers && mcpConfig.mcpServers.supabase) {
        const supabaseConfig = mcpConfig.mcpServers.supabase;
        const projectRef = supabaseConfig.args?.find(arg => arg.startsWith('--project-ref='))?.split('=')[1];
        
        console.log(`${colors.bold}${colors.green}🔗 MCP Supabase Configuration:${colors.reset}`);
        console.log(`  ✅ Supabase MCP Server configured`);
        console.log(`  ✅ Project Reference: ${projectRef || 'Found'}`);
        console.log(`  ✅ Features: ${supabaseConfig.args?.find(arg => arg.startsWith('--features='))?.split('=')[1] || 'database,docs,debugging'}`);
        console.log(`  ${colors.cyan}💡 Database operations handled via MCP - no separate Supabase client needed${colors.reset}\n`);
        return true;
      }
    } catch (error) {
      console.log(`${colors.yellow}⚠️  .mcp.json exists but couldn't parse Supabase config${colors.reset}\n`);
    }
  }
  
  console.log(`${colors.yellow}⚠️  No MCP Supabase configuration found in .mcp.json${colors.reset}\n`);
  return false;
}

function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.log(`${colors.red}❌ .env.local file not found!${colors.reset}`);
    console.log(`${colors.yellow}💡 Copy .env.prd-compliant to .env.local and fill in your values${colors.reset}\n`);
    return {};
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=').trim();
      if (value && value !== 'your-' + key.toLowerCase().replace(/_/g, '-')) {
        env[key] = value;
      }
    }
  });

  return env;
}

function validateEnvironment() {
  console.log(`${colors.bold}${colors.cyan}🔍 SuperSwift Interview Agent - Environment Validation${colors.reset}\n`);
  
  // Check for MCP Supabase configuration
  checkMCPSupabase();
  
  const env = loadEnvFile();
  let totalRequired = 0;
  let totalFound = 0;
  let criticalMissing = [];

  // Check required variables
  Object.entries(requiredVars).forEach(([category, vars]) => {
    console.log(`${colors.bold}${colors.blue}📋 ${category}:${colors.reset}`);
    
    vars.forEach(varName => {
      totalRequired++;
      if (env[varName]) {
        totalFound++;
        // Mask sensitive values
        const displayValue = varName.includes('SECRET') || varName.includes('KEY') || varName.includes('TOKEN') 
          ? '***hidden***' 
          : env[varName];
        console.log(`  ${colors.green}✅ ${varName}${colors.reset} = ${displayValue}`);
      } else {
        criticalMissing.push({ category, varName });
        console.log(`  ${colors.red}❌ ${varName}${colors.reset} - MISSING`);
      }
    });
    console.log();
  });

  // Check optional variables
  console.log(`${colors.bold}${colors.magenta}🔧 Optional Variables:${colors.reset}`);
  Object.entries(optionalVars).forEach(([category, vars]) => {
    const foundOptional = vars.filter(varName => env[varName]);
    if (foundOptional.length > 0) {
      console.log(`  ${colors.cyan}${category}:${colors.reset} ${foundOptional.length}/${vars.length} configured`);
    }
  });

  console.log(`\n${colors.bold}📊 Summary:${colors.reset}`);
  console.log(`Required variables: ${totalFound}/${totalRequired}`);
  
  if (criticalMissing.length === 0) {
    console.log(`${colors.green}${colors.bold}🎉 All required environment variables are configured!${colors.reset}`);
    console.log(`${colors.green}✅ Ready to build the SuperSwift Interview Agent${colors.reset}\n`);
    return true;
  } else {
    console.log(`${colors.red}${colors.bold}⚠️  ${criticalMissing.length} critical variables missing${colors.reset}`);
    
    console.log(`\n${colors.yellow}🚀 Next Steps:${colors.reset}`);
    console.log(`1. Copy ${colors.cyan}.env.prd-compliant${colors.reset} to ${colors.cyan}.env.local${colors.reset}`);
    console.log(`2. Configure these missing variables:`);
    
    criticalMissing.forEach(({ category, varName }) => {
      console.log(`   ${colors.red}• ${varName}${colors.reset} (${category})`);
    });
    
    console.log(`\n${colors.blue}💡 Setup guides:${colors.reset}`);
    console.log(`• Supabase: https://supabase.com/docs/guides/getting-started`);
    console.log(`• ElevenLabs: https://elevenlabs.io/docs/api-reference/getting-started`);
    console.log(`• N8N: https://docs.n8n.io/hosting/`);
    console.log(`• OpenAI: https://platform.openai.com/api-keys\n`);
    
    return false;
  }
}

// Check for required CLI tools
function validateCLITools() {
  console.log(`${colors.bold}${colors.cyan}🛠️  Checking PRD-Required CLI Tools:${colors.reset}`);
  
  const { execSync } = require('child_process');
  const tools = [
    { name: 'Node.js', command: 'node --version', required: true },
    { name: 'npm', command: 'npm --version', required: true },
    { name: 'Supabase CLI', command: 'supabase --version', required: true, note: 'PRD requirement' },
    { name: 'Deno', command: 'deno --version', required: false, note: 'Future requirement for Edge Functions' }
  ];

  tools.forEach(tool => {
    try {
      const version = execSync(tool.command, { encoding: 'utf8' }).trim();
      const status = tool.required ? '✅' : '📝';
      console.log(`  ${status} ${tool.name}: ${version.split('\n')[0]} ${tool.note ? `(${colors.yellow}${tool.note}${colors.reset})` : ''}`);
    } catch (error) {
      const status = tool.required ? '❌' : '⚠️';
      console.log(`  ${status} ${tool.name}: Not installed ${tool.note ? `(${colors.yellow}${tool.note}${colors.reset})` : ''}`);
      if (tool.required) {
        console.log(`     Install: ${getInstallCommand(tool.name)}`);
      }
    }
  });
  console.log();
}

function getInstallCommand(toolName) {
  const commands = {
    'Supabase CLI': 'npm install -g supabase',
    'Deno': 'curl -fsSL https://deno.land/install.sh | sh'
  };
  return commands[toolName] || 'Check official documentation';
}

// Main execution
if (require.main === module) {
  validateCLITools();
  const isReady = validateEnvironment();
  process.exit(isReady ? 0 : 1);
}

module.exports = { validateEnvironment, validateCLITools };