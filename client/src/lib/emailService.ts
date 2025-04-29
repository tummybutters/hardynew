import { init, send } from '@emailjs/browser';

/**
 * Initialize EmailJS with the public key from environment variables
 * @returns boolean indicating whether initialization was successful
 */
export function initEmailJS(): boolean {
  try {
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    
    if (!publicKey) {
      console.error('EmailJS public key is missing. Please check your environment variables.');
      return false;
    }
    
    init(publicKey);
    console.log('EmailJS initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing EmailJS:', error);
    return false;
  }
}

/**
 * Send a contact form email using EmailJS
 * @param formData The contact form data to send
 * @returns An object indicating success or failure
 */
export async function sendContactEmail(formData: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    
    if (!serviceId || !templateId) {
      console.error('EmailJS service ID or template ID is missing. Please check your environment variables.');
      return { 
        success: false, 
        error: 'Email service configuration is incomplete.' 
      };
    }

    // Format the email data to match the template shown in the screenshot
    const templateParams = {
      subject: formData.subject || `Contact Us: ${formData.name}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || 'Not provided',
      message: formData.message
    };

    const response = await send(
      serviceId,
      templateId,
      templateParams
    );

    if (response.status === 200) {
      return { success: true };
    } else {
      return { 
        success: false, 
        error: `Failed to send email. Status: ${response.status}` 
      };
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}