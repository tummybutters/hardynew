import twilio from 'twilio';
import { log } from './vite';

// Initialize Twilio client with environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
const authToken = process.env.TWILIO_AUTH_TOKEN || '';
const twilioPhone = process.env.TWILIO_PHONE_NUMBER || '';
const destinationPhone = process.env.DESTINATION_PHONE_NUMBER || '';

// Check if Twilio credentials are available
const isTwilioConfigured = () => {
  return !!(accountSid && authToken && twilioPhone && destinationPhone);
};

// Create Twilio client if credentials are available
const getTwilioClient = () => {
  if (!isTwilioConfigured()) {
    return null;
  }
  
  try {
    return twilio(accountSid, authToken);
  } catch (error) {
    log(`Error initializing Twilio client: ${error}`, 'error');
    return null;
  }
};

/**
 * Send SMS notification for contact form submissions
 * @param contactData Contact form data
 * @returns Promise with send status
 */
export async function sendContactSmsNotification(contactData: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject?: string;
}): Promise<boolean> {
  if (!isTwilioConfigured()) {
    log('Twilio not configured. SMS notification skipped.', 'warn');
    return false;
  }
  
  const client = getTwilioClient();
  if (!client) {
    return false;
  }
  
  try {
    const { name, email, phone, message, subject } = contactData;
    
    // Format the SMS message
    const smsBody = `
New Contact Form Submission:
Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}
${subject ? `Subject: ${subject}` : ''}
Message: ${message}
`.trim();
    
    // Send the SMS
    const result = await client.messages.create({
      body: smsBody,
      from: twilioPhone || '',
      to: destinationPhone || ''
    });
    
    log(`SMS notification sent successfully. SID: ${result.sid}`, 'info');
    return true;
  } catch (error) {
    log(`Error sending SMS notification: ${error}`, 'error');
    return false;
  }
}

/**
 * Check if Twilio credentials are valid
 * @returns Promise<boolean> indicating if credentials are valid
 */
export async function checkTwilioCredentials(): Promise<boolean> {
  if (!isTwilioConfigured()) {
    return false;
  }
  
  const client = getTwilioClient();
  if (!client) {
    return false;
  }
  
  try {
    // Just fetch account info to validate credentials
    await client.api.accounts(accountSid || '').fetch();
    log('Twilio credentials are valid', 'info');
    return true;
  } catch (error) {
    log(`Twilio credentials validation failed: ${error}`, 'error');
    return false;
  }
}