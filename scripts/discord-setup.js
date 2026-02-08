#!/usr/bin/env node
/**
 * Discord Server Setup Script
 * 
 * Sets up MoltyDEX beta tester Discord server
 * 
 * Usage:
 *   node scripts/discord-setup.js
 * 
 * Requires:
 *   - DISCORD_BOT_TOKEN in .env or .discord-bot-token file
 *   - Bot must be in server with admin permissions
 */

const { Client, GatewayIntentBits, PermissionFlagsBits, ChannelType } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Load bot token
function getBotToken() {
  // Try .env first
  if (process.env.DISCORD_BOT_TOKEN) {
    return process.env.DISCORD_BOT_TOKEN;
  }
  
  // Try .discord-bot-token file
  const tokenPath = path.join(__dirname, '..', '.discord-bot-token');
  if (fs.existsSync(tokenPath)) {
    return fs.readFileSync(tokenPath, 'utf8').trim();
  }
  
  throw new Error('DISCORD_BOT_TOKEN not found. Set in .env or .discord-bot-token file');
}

// Server structure
const SERVER_STRUCTURE = {
  channels: [
    { name: 'welcome', type: ChannelType.GuildText, topic: 'Welcome to MoltyDEX Beta Testers! Read the rules and introduce yourself.' },
    { name: 'announcements', type: ChannelType.GuildText, topic: 'Important updates and announcements' },
    { name: 'beta-testers', type: ChannelType.GuildText, topic: 'Main discussion channel for beta testers' },
    { name: 'bug-reports', type: ChannelType.GuildText, topic: 'Report bugs here. Use format: [BUG] Description' },
    { name: 'use-cases', type: ChannelType.GuildText, topic: 'Share your use case stories here. Use format: [USE_CASE] Description' },
    { name: 'integrations', type: ChannelType.GuildText, topic: 'Share your integrations and demos here. Use format: [INTEGRATION] Description' },
    { name: 'feedback', type: ChannelType.GuildText, topic: 'General feedback and suggestions' },
    { name: 'rewards', type: ChannelType.GuildText, topic: 'Reward tracking and leaderboard' },
    { name: 'help', type: ChannelType.GuildText, topic: 'Get help and ask questions' },
  ],
  roles: [
    { name: 'Beta Tester', color: 0x00ff00, mentionable: false },
    { name: 'Early Tester', color: 0xffd700, mentionable: false },
    { name: 'Bug Reporter', color: 0xff6b6b, mentionable: false },
    { name: 'Use Case Contributor', color: 0x4ecdc4, mentionable: false },
    { name: 'Integration Builder', color: 0x95e1d3, mentionable: false },
    { name: 'Admin', color: 0xff0000, mentionable: true },
  ],
};

async function setupServer(client, guildId) {
  const guild = await client.guilds.fetch(guildId);
  
  console.log(`\n🦞 Setting up Discord server: ${guild.name}\n`);
  
  // Create channels
  console.log('📝 Creating channels...');
  const channels = {};
  for (const channelConfig of SERVER_STRUCTURE.channels) {
    try {
      const channel = await guild.channels.create({
        name: channelConfig.name,
        type: channelConfig.type,
        topic: channelConfig.topic,
      });
      channels[channelConfig.name] = channel;
      console.log(`  ✅ Created #${channelConfig.name}`);
    } catch (error) {
      console.error(`  ❌ Failed to create #${channelConfig.name}:`, error.message);
    }
  }
  
  // Create roles
  console.log('\n👥 Creating roles...');
  const roles = {};
  for (const roleConfig of SERVER_STRUCTURE.roles) {
    try {
      const role = await guild.roles.create({
        name: roleConfig.name,
        color: roleConfig.color,
        mentionable: roleConfig.mentionable,
      });
      roles[roleConfig.name] = role;
      console.log(`  ✅ Created role @${roleConfig.name}`);
    } catch (error) {
      console.error(`  ❌ Failed to create role @${roleConfig.name}:`, error.message);
    }
  }
  
  // Set channel permissions
  console.log('\n🔐 Setting channel permissions...');
  
  // Welcome channel - everyone can read, only admins can send
  if (channels.welcome) {
    await channels.welcome.permissionOverwrites.create(guild.roles.everyone, {
      SendMessages: false,
      ReadMessageHistory: true,
    });
  }
  
  // Announcements - everyone can read, only admins can send
  if (channels.announcements) {
    await channels.announcements.permissionOverwrites.create(guild.roles.everyone, {
      SendMessages: false,
      ReadMessageHistory: true,
    });
  }
  
  // Rewards - everyone can read, only bot can send
  if (channels.rewards) {
    await channels.rewards.permissionOverwrites.create(guild.roles.everyone, {
      SendMessages: false,
      ReadMessageHistory: true,
    });
  }
  
  console.log('  ✅ Set channel permissions');
  
  // Send welcome message
  if (channels.welcome) {
    const welcomeMessage = `# Welcome to MoltyDEX Beta Testers! 🦞

Thank you for helping us test MoltyDEX! Here's what you need to know:

## 🎯 What We're Testing
- Token swaps (SOL ↔ USDC, any token pairs)
- API usability and reliability
- Real-world agent use cases

## 💰 Rewards
- 🎁 **Early Testers:** $10 USDC (first 20 testers)
- 🎁 **Bug Reports:** $5 USDC per valid bug
- 🎁 **Use Case Stories:** $25 USDC per story
- 🎁 **Full Integration:** $50 USDC per integration

## 📋 How to Participate
1. Test MoltyDEX: https://www.moltydex.com
2. Report findings in appropriate channels
3. Get rewarded!

## 📝 Channel Guide
- **#beta-testers** - General discussion
- **#bug-reports** - Report bugs (use [BUG] prefix)
- **#use-cases** - Share use cases (use [USE_CASE] prefix)
- **#integrations** - Share integrations (use [INTEGRATION] prefix)
- **#feedback** - General feedback
- **#help** - Get help

## 🔗 Links
- **Website:** https://www.moltydex.com
- **API Docs:** https://www.moltydex.com/developers
- **GitHub:** [Your repo]

Let's build the future of agent payments together! 🚀`;
    
    await channels.welcome.send(welcomeMessage);
    console.log('\n✅ Sent welcome message');
  }
  
  console.log('\n✅ Server setup complete!\n');
  console.log('Next steps:');
  console.log('1. Review channel structure');
  console.log('2. Customize welcome message if needed');
  console.log('3. Set up bot commands (optional)');
  console.log('4. Start inviting testers!\n');
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.error('Usage: node scripts/discord-setup.js GUILD_ID');
    console.error('\nExample:');
    console.error('  node scripts/discord-setup.js 123456789012345678');
    console.error('\nTo get GUILD_ID:');
    console.error('1. Enable Developer Mode in Discord');
    console.error('2. Right-click server → Copy ID');
    process.exit(1);
  }
  
  const guildId = args[0];
  
  try {
    const token = getBotToken();
    
    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
    
    client.once('ready', async () => {
      console.log(`✅ Bot logged in as ${client.user.tag}`);
      await setupServer(client, guildId);
      await client.destroy();
    });
    
    await client.login(token);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
    process.exit(1);
  }
}

main();
