# Slack PII Detection Bot

This bot helps detect Personally Identifiable Information (PII) in Slack messages. It scans for sensitive data like emails, phone numbers, credit card numbers, IP addresses, passport numbers, and IBANs. This supports compliance with regulations like GDPR.

## About This Project

ChatGPT wrote all the code, configuration files, and this README. The only manual steps were using Git to commit and push the code to GitHub. This project shows how you can use AI to create a simple tool that helps protect sensitive information in your workspace.

## Prerequisites

- Node.js and npm installed.
- [ngrok](https://ngrok.com/download) installed to expose the local server.
- A Slack app with the needed permissions and a bot token.

## Setup

### 1. Create a Slack App

1. Go to [Slack API: Your Apps](https://api.slack.com/apps) and click "Create New App."
2. Choose "From scratch" and name your app.
3. Select the workspace where you will install the bot.

### 2. Add Permissions

1. Under "OAuth & Permissions," add these scopes:
   - `chat:write`
   - `channels:history`
   - `channels:read`
   - `im:history`
   - `im:read`
   - `im:write`
2. Click "Install to Workspace" to get the OAuth token.

### 3. Enable Event Subscriptions

1. Under "Event Subscriptions," turn on "Enable Events."
2. Set the "Request URL" (you will get this URL from `ngrok` in step 7).
3. Under "Subscribe to Bot Events," add:
   - `message.channels`
   - `message.groups`
   - `message.im`

### 4. Set Up Locally

1. Extract the zip file or clone the repository.
2. Open the terminal and navigate to the project directory.
3. Create a `.env` file with this content:
   ```
   SLACK_BOT_TOKEN=your-slack-bot-token
   SLACK_SIGNING_SECRET=your-slack-signing-secret
   ```

### 5. Install Dependencies

```bash
npm install
```

### 6. Run the Bot

```bash
npm run start
```

### 7. Expose the Local Server with ngrok

Open a new terminal and run:

```bash
ngrok http 3000
```

Copy the public URL.

### 8. Update Slack Event Subscriptions

1. In Slack's settings, set the "Request URL" to:
   ```
   https://<your-ngrok-url>/slack/events
   ```

### 9. Test the Bot

1. Invite the bot to a channel using `/invite @botname`.
2. Send a message with PII (like an email). The bot will send a warning if it detects sensitive data.

## Supported PII Detection

The bot checks for:

- Credit Card Numbers
- Email Addresses
- Phone Numbers
- IP Addresses
- Passport Numbers
- IBANs

## Continuous Integration (CI)

The project includes a GitHub Actions workflow that runs on every push or pull request to the `main` branch. The workflow:

1. Installs dependencies.
2. Lints the code.
3. Runs the tests.

ChatGPT also wrote the CI configuration to ensure code quality and functionality.

## Notes

- Each time you restart `ngrok`, the public URL changes. Update it in Slack's settings.
- Keep the `.env` file private.

## Conclusion

This bot was created by ChatGPT, from writing code to setting up CI. This shows how AI can quickly build and test tools that protect data in your Slack workspace.
