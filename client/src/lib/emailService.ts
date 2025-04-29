import emailjs from '@emailjs/browser';

// Initialize EmailJS with the public key
export const initEmailJS = () => {
  try {
    // Using the public key directly since it's already meant to be public
    const publicKey = 'k6KdWLBsB-i4uUIa8';
    
    emailjs.init(publicKey);
    return true;
  } catch (error) {
    console.error('Error initializing EmailJS:', error);
    return false;
  }
};

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  phone?: string;
  subject?: string;
}

export const sendContactEmail = async (formData: ContactFormData) => {
  try {
    // These values should match your EmailJS configuration
    // For testing, we're hard-coding service and template IDs
    const serviceId = process.env.EMAILJS_SERVICE_ID || 'service_9o6a9hq';
    const templateId = process.env.EMAILJS_TEMPLATE_ID || 'template_njn095q';

    // Create template parameters
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
      phone: formData.phone || 'Not provided',
      subject: formData.subject || 'Contact Form Submission',
    };

    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams
    );

    return {
      success: true,
      status: response.status,
      text: response.text
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};