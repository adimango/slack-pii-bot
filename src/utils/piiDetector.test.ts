import piiDetector from './piiDetector';

describe('PII Detector', () => {
  it('should detect an email address in Slack format', () => {
    const text = '<mailto:customer@example.com|customer@example.com>';
    expect(piiDetector.detect(text)).toBe(true);
  });

  it('should detect a credit card number', () => {
    const text = "The customer's credit card number is 4242 4242 4242 4242";
    expect(piiDetector.detect(text)).toBe(true);
  });

  it('should detect a European phone number', () => {
    const text = 'The customer can be reached at +44 20 7946 0958';
    expect(piiDetector.detect(text)).toBe(true);
  });

  it('should detect an American phone number', () => {
    const text = "The customer's contact number is +1-800-555-1234";
    expect(piiDetector.detect(text)).toBe(true);
  });

  it('should detect sensitive information in a support message', () => {
    const text =
      'Customer John Doe called and provided credit card number 4242 4242 4242 4242 for the order.';
    expect(piiDetector.detect(text)).toBe(true);
  });

  it('should not detect PII in regular support messages', () => {
    const text =
      'The customer reported an issue with their order and is requesting a refund.';
    expect(piiDetector.detect(text)).toBe(false);
  });
});
