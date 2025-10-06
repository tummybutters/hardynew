import { Helmet } from 'react-helmet';

export default function SmsTerms() {
  return (
    <>
      <Helmet>
        <title>SMS Terms & Conditions | Hardys Wash N' Wax</title>
        <meta name="description" content="SMS text messaging terms and conditions for Hardys Wash N' Wax mobile car detailing services. Learn about our 10DLC compliant messaging program." />
        <link rel="canonical" href="https://www.hardyswashnwax.com/sms-terms" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">SMS Terms & Conditions</h1>
        <p className="text-sm text-gray-600 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">SMS Messaging Program</h2>
            <p className="text-gray-700 mb-4">
              Hardys Wash N' Wax offers an SMS text messaging service to provide booking confirmations, appointment reminders, service updates, and promotional offers to our customers. By opting in to receive SMS messages from us, you agree to these Terms and Conditions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10DLC Compliance</h2>
            <p className="text-gray-700 mb-4">
              Our SMS messaging program is compliant with 10DLC (10-Digit Long Code) regulations established by mobile carriers and The Campaign Registry (TCR). This ensures:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Higher message deliverability rates</li>
              <li>Protection against spam and fraud</li>
              <li>Verified business identity and messaging practices</li>
              <li>Compliance with TCPA (Telephone Consumer Protection Act) and CTIA guidelines</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Consent to Receive Messages</h2>
            <p className="text-gray-700 mb-4">
              By providing your mobile phone number and agreeing to receive text messages, you expressly consent to receive:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li><strong>Transactional Messages:</strong> Booking confirmations, appointment reminders, service updates, and arrival notifications</li>
              <li><strong>Marketing Messages:</strong> Promotional offers, special deals, and service announcements (if you opt in separately)</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Consent is not a condition of purchase. You can still use our services without subscribing to SMS notifications.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Message Frequency</h2>
            <p className="text-gray-700 mb-4">
              The frequency of messages will vary depending on your booking activity and preferences:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li><strong>Transactional Messages:</strong> Sent as needed for each booking (typically 2-4 messages per appointment)</li>
              <li><strong>Marketing Messages:</strong> Up to 4 promotional messages per month (if opted in)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Message and Data Rates</h2>
            <p className="text-gray-700 mb-4">
              Message and data rates may apply based on your mobile phone plan. Please contact your wireless carrier for details on your specific plan. Hardys Wash N' Wax is not responsible for any charges from your carrier.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Opt Out</h2>
            <p className="text-gray-700 mb-4">
              You may opt out of receiving SMS messages at any time by:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Replying <strong>STOP</strong>, <strong>END</strong>, <strong>CANCEL</strong>, <strong>UNSUBSCRIBE</strong>, or <strong>QUIT</strong> to any message</li>
              <li>Contacting us at hardyswashnwax@gmail.com or (949) 734-0201</li>
              <li>Updating your communication preferences in your account settings (if applicable)</li>
            </ul>
            <p className="text-gray-700 mb-4">
              After opting out, you will receive one final confirmation message. You may continue to receive critical transactional messages related to active bookings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Getting Help</h2>
            <p className="text-gray-700 mb-4">
              For assistance with SMS messages, you can:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Reply <strong>HELP</strong> or <strong>INFO</strong> to any message</li>
              <li>Email us at hardyswashnwax@gmail.com</li>
              <li>Call us at (949) 734-0201</li>
              <li>Visit our website at www.hardyswashnwax.com</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Supported Carriers</h2>
            <p className="text-gray-700 mb-4">
              Our SMS messaging service is supported by all major U.S. carriers, including but not limited to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>AT&T, Verizon Wireless, T-Mobile, Sprint</li>
              <li>Boost Mobile, Cricket Wireless, Metro PCS</li>
              <li>U.S. Cellular, Virgin Mobile, and others</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Carriers are not liable for delayed or undelivered messages.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy and Data Security</h2>
            <p className="text-gray-700 mb-4">
              We respect your privacy and protect your personal information. Your mobile phone number and message data are:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Used solely for the purposes described in these terms</li>
              <li>Protected with industry-standard security measures</li>
              <li>Never sold, rented, or shared with third parties for their marketing purposes</li>
              <li>Subject to our <a href="/privacy-policy" className="text-[#EE432C] hover:underline">Privacy Policy</a></li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Twilio Integration</h2>
            <p className="text-gray-700 mb-4">
              Our SMS messaging is powered by Twilio, a trusted and compliant messaging platform. Twilio's services are:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Registered and verified with The Campaign Registry (TCR)</li>
              <li>Compliant with 10DLC regulations</li>
              <li>TCPA and CTIA compliant</li>
              <li>Subject to Twilio's Terms of Service and Privacy Policy</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Phone Number</h2>
            <p className="text-gray-700 mb-4">
              If you change your mobile phone number, please notify us immediately to update your contact information. You are responsible for any messages sent to your previous number until we receive notice of the change.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Availability</h2>
            <p className="text-gray-700 mb-4">
              We strive to provide reliable SMS service, but we do not guarantee uninterrupted service. Messages may be delayed or not delivered due to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Carrier network issues</li>
              <li>Technical difficulties</li>
              <li>Weather or natural disasters</li>
              <li>Maintenance or system upgrades</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Hardys Wash N' Wax is not liable for any delays or failures in message delivery.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Prohibited Uses</h2>
            <p className="text-gray-700 mb-4">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Use our SMS service to send spam or unsolicited messages</li>
              <li>Attempt to disrupt or interfere with our messaging systems</li>
              <li>Share or resell access to our SMS service</li>
              <li>Use our service for any illegal or unauthorized purpose</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Modifications to Terms</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify these SMS Terms and Conditions at any time. Changes will be effective when posted on this page with an updated "Last Updated" date. Continued use of our SMS service after changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to terminate or suspend SMS service to any user who:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Violates these terms</li>
              <li>Engages in abusive or harassing behavior</li>
              <li>Uses the service for fraudulent purposes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-700 mb-4">
              For questions about our SMS messaging program or these terms, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-2"><strong>Hardys Wash N' Wax</strong></p>
              <p className="text-gray-700 mb-2">Email: hardyswashnwax@gmail.com</p>
              <p className="text-gray-700 mb-2">Phone: (949) 734-0201</p>
              <p className="text-gray-700 mb-2">Website: www.hardyswashnwax.com</p>
              <p className="text-gray-700">Sacramento, CA</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Disclaimer</h2>
            <p className="text-gray-700 mb-4">
              SMS messages are provided as a convenience and are not guaranteed to be received in a timely manner. You should not rely solely on SMS messages for time-sensitive information. Hardys Wash N' Wax is not responsible for any damages resulting from delayed, failed, or undelivered messages.
            </p>
          </section>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mt-8">
            <p className="text-blue-900 font-semibold mb-2">Quick Reference</p>
            <ul className="list-none text-blue-800 space-y-1">
              <li>• To opt out: Reply <strong>STOP</strong></li>
              <li>• For help: Reply <strong>HELP</strong></li>
              <li>• Message frequency: Varies by booking activity</li>
              <li>• Message and data rates may apply</li>
              <li>• Privacy Policy: <a href="/privacy-policy" className="underline">www.hardyswashnwax.com/privacy-policy</a></li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
