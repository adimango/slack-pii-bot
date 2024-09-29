
import validator from 'validator';

// PII detection service focusing on different PII patterns
const patterns = {
  email: /<mailto:[^|]+\|([^>]+)>|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, // Email addresses in Slack's format
  phoneNumber: /\b(\+?\d{1,4}?[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9})\b/, // Phone Numbers
  ipAddress: /\b(?:\d{1,3}\.){3}\d{1,3}\b/, // IPv4 Addresses
  passportNumber: /\b[A-Z]{2}\d{7}\b/, // European Passport Numbers
  iban: /[A-Z]{2}\d{2}[ ]?\d{4}[ ]?\d{4}[ ]?\d{4}[ ]?\d{4}(?:[ ]?\d{0,2})?/, // International Bank Account Number (IBAN)
};

const detect = (text: string): boolean => {
  // Check using patterns
  const patternDetected = Object.values(patterns).some((regex) => regex.test(text));

  // Check for credit card numbers using the validator library
  const containsCreditCard = text.split(/\s+/).some((word) => validator.isCreditCard(word));

  return patternDetected || containsCreditCard;
};

export default {
  detect,
};
