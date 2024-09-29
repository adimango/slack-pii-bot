import { App, ExpressReceiver } from '@slack/bolt';
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import botService from './services/botService';
import detectPII from './utils/piiDetector';

dotenv.config();

// Create a custom receiver for the Express app
const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET || '',
});

const slackApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver,
});

// Get bot user ID to prevent loops
let botUserId: string | undefined;
(async () => {
  try {
    const authResponse = await slackApp.client.auth.test();
    if (authResponse.user_id) {
      botUserId = authResponse.user_id;
    } else {
      console.error('Failed to retrieve bot user ID.');
    }
  } catch (error) {
    console.error('Error fetching bot user ID:', error);
  }
})();

// Use the botService to handle messages
botService(slackApp);

const expressApp = express();
expressApp.use(bodyParser.urlencoded({ extended: true }));
expressApp.use(bodyParser.json());

// Manually handle Slack URL verification and other events
expressApp.post('/slack/events', async (req, res) => {
  const { type, challenge, event } = req.body;

  // Handle Slack URL verification
  if (type === 'url_verification') {
    return res.status(200).send({ challenge });
  }

  // Process message events
  if (event && event.type === 'message') {
    // Ignore messages sent by the bot itself
    if (event.subtype === 'bot_message' || event.user === botUserId) {
      return res.status(200).send();
    }

    // Use the PII detector to check if the message contains PII
    if (detectPII.detect(event.text)) {
      try {
        await slackApp.client.chat.postMessage({
          channel: event.channel,
          text: ':warning: PII detected in your message. Please be careful about sharing sensitive information.',
          thread_ts: event.ts, // Send as a reply in the thread
        });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  }

  res.status(200).send();
});

// Attach the Slack event handler using receiver.router
expressApp.use('/slack/events', receiver.router);

// Start the express server
const PORT = process.env.PORT || 3000;
expressApp.listen(PORT, () => {
  console.log(`⚡️ Server is running on port ${PORT}`);
});
