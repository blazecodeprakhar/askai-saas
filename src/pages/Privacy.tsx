import PageLayout from '@/components/layout/PageLayout';
import { Shield } from 'lucide-react';

const Privacy = () => {
  return (
    <PageLayout title="Privacy Policy">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-primary" />
          <p className="text-muted-foreground text-sm">Effective Date: January 10, 2026 | Last Updated: January 11, 2026</p>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <section>
            <p className="text-muted-foreground leading-relaxed">
              AskAI Chat ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our AI-powered chat application and related services 
              (collectively, the "Service"). Please read this policy carefully. By accessing or using the Service, you acknowledge 
              that you have read, understood, and agree to be bound by this Privacy Policy.
            </p>
          </section>

          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
            
            <h3 className="text-lg font-medium text-foreground mb-2">1.1 Information You Provide</h3>
            <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1 ml-4">
              <li><strong>Account Information:</strong> Email address, display name, and password when you create an account</li>
              <li><strong>Conversation Data:</strong> Messages, queries, and content you submit through the chat interface</li>
              <li><strong>Uploaded Files:</strong> Documents, images, and other files you upload for AI analysis</li>
              <li><strong>Communications:</strong> Information you provide when contacting our support team</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mb-2">1.2 Automatically Collected Information</h3>
            <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1 ml-4">
              <li><strong>Device Information:</strong> Browser type, operating system, device identifiers</li>
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent on the Service</li>
              <li><strong>Log Data:</strong> IP address, access times, referring URLs, and error logs</li>
              <li><strong>Cookies:</strong> Session cookies and local storage for authentication and preferences</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-3">We use the collected information for the following purposes:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>To provide, operate, and maintain the Service</li>
              <li>To process and respond to your AI chat queries</li>
              <li>To authenticate users and secure your account</li>
              <li>To save and retrieve your conversation history</li>
              <li>To analyze and improve the Service's functionality and user experience</li>
              <li>To send technical notices, updates, and security alerts</li>
              <li>To respond to your comments, questions, and support requests</li>
              <li>To detect, prevent, and address technical issues and security threats</li>
              <li>To comply with legal obligations and enforce our terms</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">3. Data Sharing and Disclosure</h2>
            <p className="text-muted-foreground mb-3">We do not sell, trade, or rent your personal information. We may share information in the following circumstances:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li><strong>Service Providers:</strong> Third-party vendors who assist in operating our Service (e.g., cloud hosting, AI processing)</li>
              <li><strong>AI Model Providers:</strong> Your queries are processed by Google's Gemini AI to generate responses</li>
              <li><strong>Legal Requirements:</strong> When required by law, subpoena, or other legal process</li>
              <li><strong>Protection of Rights:</strong> To protect our rights, privacy, safety, or property</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">4. Data Security</h2>
            <p className="text-muted-foreground mb-3">We implement industry-standard security measures to protect your information:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>TLS 1.3 encryption for all data transmitted between your device and our servers</li>
              <li>Encrypted password storage using bcrypt hashing algorithms</li>
              <li>Row Level Security (RLS) policies ensuring data isolation between users</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Secure API key management with no credentials exposed in client code</li>
              <li>Server-side input validation to prevent injection attacks</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              While we strive to use commercially acceptable means to protect your information, no method of transmission over 
              the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">5. Data Retention</h2>
            <p className="text-muted-foreground">
              We retain your personal information for as long as your account is active or as needed to provide you with the Service. 
              Conversation history is stored indefinitely unless you choose to delete it. You may request deletion of your account and 
              associated data at any time by contacting us. We may retain certain information as required by law or for legitimate 
              business purposes.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">6. Your Rights and Choices</h2>
            <p className="text-muted-foreground mb-3">Depending on your location, you may have the following rights:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data</li>
              <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format</li>
              <li><strong>Opt-out:</strong> Opt out of marketing communications</li>
              <li><strong>Withdraw Consent:</strong> Withdraw previously given consent</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              To exercise these rights, please contact us at the email address provided below.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">7. Third-Party Services</h2>
            <p className="text-muted-foreground">
              The Service may contain links to third-party websites or integrate with third-party services. We are not responsible 
              for the privacy practices of these third parties. We encourage you to review the privacy policies of any third-party 
              services you access through our Service.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">8. Children's Privacy</h2>
            <p className="text-muted-foreground">
              The Service is not intended for individuals under the age of 13 (or the applicable age of consent in your jurisdiction). 
              We do not knowingly collect personal information from children. If we become aware that we have collected personal 
              information from a child without parental consent, we will take steps to delete that information.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">9. International Data Transfers</h2>
            <p className="text-muted-foreground">
              Your information may be transferred to and processed in countries other than your country of residence. These countries 
              may have different data protection laws. By using the Service, you consent to the transfer of your information to these 
              countries. We ensure appropriate safeguards are in place for such transfers.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">10. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new 
              Privacy Policy on this page and updating the "Last Updated" date. Your continued use of the Service after such changes 
              constitutes your acceptance of the updated policy.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">11. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="mt-4 p-4 rounded-lg bg-muted/20 border border-border">
              <p className="text-foreground font-medium">AskAI Chat</p>
              <p className="text-muted-foreground">Developer: Prakhar Yadav</p>
              <p className="text-muted-foreground">
                Email:{' '}
                <a href="mailto:prakharyadav096@gmail.com" className="text-primary hover:underline">
                  prakharyadav096@gmail.com
                </a>
              </p>
              <p className="text-muted-foreground">
                Website:{' '}
                <a href="https://prakharcodes.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  prakharcodes.netlify.app
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </PageLayout>
  );
};

export default Privacy;