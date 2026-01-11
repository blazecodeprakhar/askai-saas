import PageLayout from '@/components/layout/PageLayout';
import { FileText } from 'lucide-react';

const Terms = () => {
  return (
    <PageLayout title="Terms & Conditions">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-5 h-5 text-primary" />
          <p className="text-muted-foreground text-sm">Effective Date: January 10, 2026 | Last Updated: January 11, 2026</p>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <section>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to AskAI Chat. These Terms and Conditions ("Terms") govern your access to and use of the AskAI Chat 
              application, website, and related services (collectively, the "Service") operated by Prakhar Yadav ("we," "us," or "our"). 
              By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, 
              you may not access or use the Service.
            </p>
          </section>

          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground mb-3">
              By creating an account, accessing, or using the Service, you acknowledge that you have read, understood, and agree 
              to be bound by these Terms and our Privacy Policy. If you are using the Service on behalf of an organization, you 
              represent and warrant that you have the authority to bind that organization to these Terms.
            </p>
            <p className="text-muted-foreground">
              You must be at least 13 years old (or the age of digital consent in your jurisdiction) to use the Service. 
              If you are under 18, you must have parental or guardian consent.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground mb-3">
              AskAI Chat is an AI-powered conversational assistant that provides:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Natural language conversations powered by artificial intelligence</li>
              <li>Document and image analysis with text extraction capabilities</li>
              <li>Code assistance and technical help</li>
              <li>Creative writing and content generation</li>
              <li>General information and research assistance</li>
              <li>Interactive games and entertainment features</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">3. User Accounts</h2>
            <p className="text-muted-foreground mb-3">
              To access certain features of the Service, you may be required to create an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security and confidentiality of your login credentials</li>
              <li>Accept responsibility for all activities that occur under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              We reserve the right to suspend or terminate accounts that violate these Terms or remain inactive for extended periods.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">4. Acceptable Use Policy</h2>
            <p className="text-muted-foreground mb-3">You agree NOT to use the Service to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Violate any applicable laws, regulations, or third-party rights</li>
              <li>Generate, distribute, or store illegal, harmful, or offensive content</li>
              <li>Harass, abuse, threaten, or harm any person or entity</li>
              <li>Impersonate any person or entity or misrepresent your affiliation</li>
              <li>Attempt to gain unauthorized access to the Service or its systems</li>
              <li>Interfere with or disrupt the Service's infrastructure or other users</li>
              <li>Transmit malware, viruses, or other harmful code</li>
              <li>Scrape, crawl, or use automated means to access the Service without permission</li>
              <li>Circumvent any rate limits, usage restrictions, or security measures</li>
              <li>Use the Service to develop competing products or services</li>
              <li>Generate content that promotes violence, discrimination, or illegal activities</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">5. Intellectual Property Rights</h2>
            <h3 className="text-lg font-medium text-foreground mb-2">5.1 Our Intellectual Property</h3>
            <p className="text-muted-foreground mb-3">
              The Service, including its design, code, features, and content (excluding user-generated content), is owned by us 
              and protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, 
              sell, or lease any part of the Service without our prior written consent.
            </p>
            
            <h3 className="text-lg font-medium text-foreground mb-2">5.2 User Content</h3>
            <p className="text-muted-foreground">
              You retain ownership of content you create and submit through the Service. By submitting content, you grant us a 
              non-exclusive, worldwide, royalty-free license to use, store, and process your content solely to provide and improve 
              the Service. You represent that you have all necessary rights to submit such content.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">6. AI-Generated Content Disclaimer</h2>
            <p className="text-muted-foreground mb-3">
              The Service uses artificial intelligence to generate responses. You acknowledge and agree that:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>AI-generated responses may contain errors, inaccuracies, or outdated information</li>
              <li>Responses are generated algorithmically and do not constitute professional advice</li>
              <li>You should independently verify important information before relying on it</li>
              <li>We are not responsible for decisions made based on AI-generated content</li>
              <li>The AI may occasionally produce unexpected or inappropriate outputs</li>
            </ul>
            <p className="text-muted-foreground mt-3 font-medium">
              The Service is not a substitute for professional advice from qualified doctors, lawyers, financial advisors, 
              or other licensed professionals.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">7. Service Availability and Modifications</h2>
            <p className="text-muted-foreground mb-3">
              We strive to maintain high availability but do not guarantee uninterrupted access to the Service. We reserve the right to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Modify, suspend, or discontinue the Service (or any part) at any time</li>
              <li>Perform maintenance that may temporarily affect availability</li>
              <li>Update features, functionality, or user interface</li>
              <li>Impose usage limits or rate restrictions</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              We will make reasonable efforts to provide advance notice of significant changes when possible.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">8. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, 
              INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, 
              AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR FREE 
              FROM VIRUSES OR OTHER HARMFUL COMPONENTS. YOUR USE OF THE SERVICE IS AT YOUR SOLE RISK.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">9. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL WE, OUR AFFILIATES, DIRECTORS, EMPLOYEES, OR AGENTS 
              BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, 
              DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (A) YOUR ACCESS TO OR USE OF OR INABILITY TO 
              ACCESS OR USE THE SERVICE; (B) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE; (C) ANY CONTENT OBTAINED 
              FROM THE SERVICE; OR (D) UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT, WHETHER BASED 
              ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY OTHER LEGAL THEORY, WHETHER OR NOT WE HAVE BEEN INFORMED 
              OF THE POSSIBILITY OF SUCH DAMAGE.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">10. Indemnification</h2>
            <p className="text-muted-foreground">
              You agree to defend, indemnify, and hold harmless us and our affiliates, officers, directors, employees, and agents 
              from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees, 
              arising out of or in any way connected with (a) your access to or use of the Service; (b) your violation of these Terms; 
              (c) your violation of any third-party right; or (d) your user content.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">11. Termination</h2>
            <p className="text-muted-foreground mb-3">
              We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, 
              including if you breach these Terms. Upon termination:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Your right to use the Service will immediately cease</li>
              <li>We may delete your account and associated data</li>
              <li>All provisions of these Terms which should survive termination will survive</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              You may terminate your account at any time by contacting us or using account deletion features if available.
            </p>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">12. Governing Law and Dispute Resolution</h2>
            <p className="text-muted-foreground">
              These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict 
              of law provisions. Any disputes arising from or relating to these Terms or the Service shall be resolved through 
              good-faith negotiations. If negotiations fail, disputes shall be submitted to the exclusive jurisdiction of the 
              courts located in India.
            </p>
          </section>

          {/* Section 13 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">13. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated 
              Terms on the Service and updating the "Last Updated" date. Your continued use of the Service after such changes 
              constitutes your acceptance of the modified Terms. If you do not agree to the modified Terms, you must stop using 
              the Service.
            </p>
          </section>

          {/* Section 14 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">14. General Provisions</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Entire Agreement:</strong> These Terms, together with our Privacy Policy, constitute the entire agreement between you and us regarding the Service.</li>
              <li><strong>Severability:</strong> If any provision is found invalid or unenforceable, the remaining provisions will continue in effect.</li>
              <li><strong>Waiver:</strong> Our failure to enforce any right or provision will not be considered a waiver of those rights.</li>
              <li><strong>Assignment:</strong> You may not assign these Terms without our consent. We may assign our rights and obligations freely.</li>
            </ul>
          </section>

          {/* Section 15 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">15. Contact Information</h2>
            <p className="text-muted-foreground">
              If you have any questions about these Terms, please contact us:
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

export default Terms;