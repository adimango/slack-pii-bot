
import { App } from '@slack/bolt';
import piiDetector from '../utils/piiDetector';
import { SlackMessage } from '../models/SlackMessage';
import { SlackResponse } from '../models/SlackResponse';

const botService = (app: App): void => {
  app.message(async ({ message, say }) => {
    const slackMessage = message as SlackMessage;

    // Log the message text for debugging
    console.log('Received message:', slackMessage);

    if (slackMessage.subtype && slackMessage.subtype === 'bot_message') {
      console.log('Ignoring bot message.');
      return;
    }

    if (!slackMessage.text) {
      console.log('No text found in message.');
      return;
    }

    // Extract plain text from the message, removing Slack formatting
    const cleanedText = slackMessage.text.replace(/<mailto:([^|]+)\|[^>]+>/g, '$1');
    console.log('Cleaned message text:', cleanedText);

    // Check for PII in the cleaned message text
    if (piiDetector.detect(cleanedText)) {
      console.log('PII detected in the message.');

      const response: SlackResponse = {
        channel: slackMessage.channel,
        text: ':warning: PII detected in your message. Please be careful about sharing sensitive information.',
      };

      await say(response.text);
    } else {
      console.log('No PII detected in the message.');
    }
  });
};

export default botService;
