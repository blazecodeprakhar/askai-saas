import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { ChevronDown, HelpCircle, FileText, Shield, Zap, CreditCard, User, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQCategory {
  icon: React.ElementType;
  title: string;
  faqs: { question: string; answer: string }[];
}

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<string | null>('general-0');

  const categories: FAQCategory[] = [
    {
      icon: HelpCircle,
      title: 'General',
      faqs: [
        {
          question: 'What is AskAI Chat?',
          answer: 'AskAI Chat is a production-ready, AI-powered conversational assistant built by Prakhar Yadav. It uses advanced language models (Google Gemini) to provide intelligent, context-aware responses for a wide range of tasks including answering questions, writing content, coding assistance, document analysis, and interactive games. The application features real-time streaming responses, persistent conversation history, and enterprise-grade security.',
        },
        {
          question: 'How does AskAI Chat work?',
          answer: 'When you send a message, it\'s processed through our secure backend and sent to Google\'s Gemini AI model. The AI analyzes your query along with any uploaded documents or images, and generates a response that streams back to you in real-time. Your conversations are stored securely in our database with Row Level Security, ensuring only you can access your chat history.',
        },
        {
          question: 'What can I ask AskAI Chat?',
          answer: 'You can ask virtually anything! AskAI Chat excels at: answering factual questions, explaining complex concepts, helping with coding and debugging, writing and editing content, summarizing documents, analyzing images and PDFs, brainstorming ideas, playing word games, and general conversation. However, for critical decisions in areas like medical, legal, or financial matters, we recommend consulting qualified professionals.',
        },
        {
          question: 'Is AskAI Chat available 24/7?',
          answer: 'Yes, AskAI Chat is available around the clock. Our infrastructure is designed for high availability with automatic scaling. However, occasional maintenance windows may temporarily affect availability. We strive to schedule maintenance during off-peak hours and provide advance notice when possible.',
        },
      ],
    },
    {
      icon: User,
      title: 'Accounts & Access',
      faqs: [
        {
          question: 'Do I need an account to use AskAI Chat?',
          answer: 'You can try AskAI Chat as a guest with a limited number of messages per session. To unlock unlimited messaging, persistent conversation history, and additional features, you\'ll need to create a free account with your email address.',
        },
        {
          question: 'How do I create an account?',
          answer: 'Click the user icon in the top-right corner and select "Sign Up." Enter your email address and create a secure password. Your account will be ready instantly with email confirmation enabled for security.',
        },
        {
          question: 'Can I delete my account and data?',
          answer: 'Yes, you have full control over your data. You can delete individual conversations from the sidebar, or contact us to request complete account deletion. We\'ll remove all your personal data, conversation history, and account information within 30 days of your request.',
        },
        {
          question: 'What happens to my conversations when I sign out?',
          answer: 'Your conversations are securely stored in our database and will be available when you sign back in. Guest conversations are stored only for the current session and will be lost when you close the browser or after the session expires.',
        },
      ],
    },
    {
      icon: FileText,
      title: 'Document & Image Analysis',
      faqs: [
        {
          question: 'What file types can AskAI Chat analyze?',
          answer: 'AskAI Chat supports a wide range of file formats including: PDF documents, Microsoft Word (DOC, DOCX), PowerPoint presentations (PPT, PPTX), text files (TXT), and images (JPG, PNG, GIF, WebP). Our system uses OCR (Optical Character Recognition) to extract text from images and scanned documents.',
        },
        {
          question: 'How accurate is the document analysis?',
          answer: 'Our document analysis leverages Google\'s advanced Vision AI for OCR and text extraction. Accuracy is typically very high for clearly printed text and standard document formats. Handwritten text, complex layouts, or low-quality scans may have reduced accuracy. We recommend reviewing extracted content for critical applications.',
        },
        {
          question: 'Is there a file size limit?',
          answer: 'Yes, individual files are limited to 10MB to ensure fast processing and optimal user experience. For larger documents, we recommend splitting them into smaller sections or extracting the most relevant pages.',
        },
        {
          question: 'Are my uploaded documents stored securely?',
          answer: 'Yes, all uploaded files are processed securely and are not stored permanently on our servers. Document content is extracted, analyzed, and then the original file is discarded. Only the extracted text may be retained as part of your conversation context, protected by our security measures.',
        },
      ],
    },
    {
      icon: Shield,
      title: 'Security & Privacy',
      faqs: [
        {
          question: 'Is my data secure?',
          answer: 'Absolutely. We implement industry-leading security measures including: TLS 1.3 encryption for all data in transit, bcrypt password hashing, Row Level Security (RLS) ensuring data isolation between users, comprehensive input validation, and secure API key management. All API credentials are stored in environment variables, never in client-side code.',
        },
        {
          question: 'Do you share my conversations with third parties?',
          answer: 'We do not sell, trade, or share your personal data or conversations with third parties for marketing purposes. Your queries are sent to Google\'s Gemini AI for processing responses, which is necessary for the service to function. Please refer to our Privacy Policy for complete details on data handling.',
        },
        {
          question: 'How long do you retain my data?',
          answer: 'Your conversation history is retained as long as your account is active, allowing you to access past conversations anytime. You can delete individual conversations or request complete data deletion. We may retain anonymized, aggregated data for service improvement.',
        },
        {
          question: 'Is AskAI Chat GDPR compliant?',
          answer: 'We strive to comply with GDPR and other privacy regulations. You have the right to access, correct, export, and delete your personal data. Contact us to exercise these rights. We maintain transparent data practices and provide clear information about how we collect and use data.',
        },
      ],
    },
    {
      icon: Zap,
      title: 'Performance & Technical',
      faqs: [
        {
          question: 'Why are responses streaming word by word?',
          answer: 'We use Server-Sent Events (SSE) streaming to deliver responses in real-time as they\'re generated by the AI. This provides a more natural, engaging experience similar to chatting with a human, and allows you to start reading the response immediately without waiting for the complete generation.',
        },
        {
          question: 'What should I do if responses are slow or not loading?',
          answer: 'First, check your internet connection. If the issue persists, try refreshing the page or clearing your browser cache. During high-demand periods, response times may temporarily increase. If you continue experiencing issues, please contact our support team with details about the problem.',
        },
        {
          question: 'Which browsers are supported?',
          answer: 'AskAI Chat works best on modern browsers including Chrome, Firefox, Safari, and Edge (latest versions). We recommend keeping your browser updated for the best experience. Some older browsers may have limited functionality.',
        },
        {
          question: 'Can I use AskAI Chat on mobile devices?',
          answer: 'Yes! AskAI Chat is fully responsive and works great on smartphones and tablets. Simply visit the website in your mobile browser. The interface automatically adapts to smaller screens for optimal usability.',
        },
      ],
    },
    {
      icon: CreditCard,
      title: 'Pricing & Plans',
      faqs: [
        {
          question: 'Is AskAI Chat free to use?',
          answer: 'AskAI Chat offers free access with generous usage limits. Guest users can send a limited number of messages per session. Registered users enjoy expanded limits. For heavy usage or commercial applications, premium plans may be available in the future.',
        },
        {
          question: 'Are there usage limits?',
          answer: 'Yes, to ensure fair usage and service quality: Guest users have a limited message count per session; Registered users have higher daily limits; Very long messages or documents may count as multiple queries. These limits help us maintain fast, reliable service for everyone.',
        },
        {
          question: 'Will there be paid plans in the future?',
          answer: 'We may introduce premium plans with additional features such as higher usage limits, priority response times, advanced document processing, and dedicated support. Free access will always be available for basic usage. Stay tuned for announcements!',
        },
      ],
    },
    {
      icon: MessageSquare,
      title: 'Support & Feedback',
      faqs: [
        {
          question: 'How can I report a bug or issue?',
          answer: 'We appreciate bug reports! Please visit our Contact page or email us directly at prakharyadav096@gmail.com. Include as much detail as possible: what you were doing, what happened, what you expected, and any error messages. Screenshots are very helpful.',
        },
        {
          question: 'How can I suggest new features?',
          answer: 'We love hearing from our users! Send your feature suggestions to prakharyadav096@gmail.com or use the Contact form. We carefully review all suggestions and prioritize based on user demand and feasibility.',
        },
        {
          question: 'How do I contact support?',
          answer: 'You can reach our support team through the Contact page on this website, or email us directly at prakharyadav096@gmail.com. We typically respond within 24-48 hours. For urgent issues, please include "URGENT" in your subject line.',
        },
      ],
    },
  ];

  const toggleFAQ = (categoryIndex: number, faqIndex: number) => {
    const key = `${categories[categoryIndex].title.toLowerCase()}-${faqIndex}`;
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <PageLayout title="Help Center">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">
            Find comprehensive answers to common questions about AskAI Chat. Can't find what you're looking for? 
            Contact our support team.
          </p>
        </div>

        <div className="space-y-8">
          {categories.map((category, categoryIndex) => (
            <div key={category.title} className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <category.icon className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">{category.title}</h3>
              </div>

              <div className="space-y-2">
                {category.faqs.map((faq, faqIndex) => {
                  const key = `${category.title.toLowerCase()}-${faqIndex}`;
                  const isOpen = openIndex === key;

                  return (
                    <div
                      key={faqIndex}
                      className="rounded-xl border border-border overflow-hidden transition-colors hover:border-primary/30"
                    >
                      <button
                        onClick={() => toggleFAQ(categoryIndex, faqIndex)}
                        className="w-full flex items-center justify-between p-4 text-left bg-muted/20 hover:bg-muted/30 transition-colors"
                      >
                        <span className="font-medium text-foreground pr-4">{faq.question}</span>
                        <ChevronDown
                          className={cn(
                            'w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-200',
                            isOpen && 'rotate-180'
                          )}
                        />
                      </button>
                      <div
                        className={cn(
                          'overflow-hidden transition-all duration-300',
                          isOpen ? 'max-h-[500px]' : 'max-h-0'
                        )}
                      >
                        <div className="p-4 text-muted-foreground leading-relaxed border-t border-border">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 rounded-xl bg-primary/10 border border-primary/30 text-center">
          <h3 className="font-semibold text-foreground mb-2">Still have questions?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Our support team is here to help. Reach out and we'll get back to you within 24-48 hours.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </PageLayout>
  );
};

export default FAQ;