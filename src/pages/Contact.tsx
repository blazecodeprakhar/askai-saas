import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Mail, MessageSquare, MapPin, Send, Loader2 } from 'lucide-react';

const Contact = () => {
  const [result, setResult] = useState("");

  // Handle form submission using Web3Forms API
  const onSubmit = async (event: any) => {
    event.preventDefault(); // Prevent default form refresh
    setResult("Sending....");

    // Create FormData object from form fields
    const formData = new FormData(event.target);

    // Add Web3Forms Access Key
    formData.append("access_key", "05324432-2768-44cd-a9e5-7bd85afe2d27");

    // Custom email styling/details - makes notifications professional
    const name = formData.get("name");
    formData.append("subject", `AskAI Get in Touch: Message from ${name}`);
    formData.append("from_name", "AskAI Contact Form");

    // Send POST request to Web3Forms
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult("Error");
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'prakharyadav096@gmail.com',
      href: 'mailto:prakharyadav096@gmail.com',
    },
    {
      icon: MessageSquare,
      label: 'Social',
      value: '@iitzprakhar',
      href: 'https://www.instagram.com/iitzprakhar/',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'India',
      href: '#',
    },
  ];

  return (
    <PageLayout title="Contact Us">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Get in Touch</h2>
          <p className="text-muted-foreground mb-6">
            Have a question or feedback? We'd love to hear from you.
          </p>

          {result === "Form Submitted Successfully" ? (
            <div className="p-6 rounded-xl bg-success/10 border border-success/30 text-center animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-3">
                <Send className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Message Sent!</h3>
              <p className="text-sm text-muted-foreground">
                Thank you for reaching out. We'll get back to you soon.
              </p>
            </div>
          ) : result === "Error" ? (
            <div className="p-6 rounded-xl bg-destructive/10 border border-destructive/30 text-center animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Oops! Something went wrong</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Please try again or contact us directly at prakharyadav096@gmail.com
              </p>
              <button
                onClick={() => setResult("")}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Your message..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 px-6 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {result === "Sending...." ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Form
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Contact Information</h2>
          <div className="space-y-4">
            {contactInfo.map((info) => (
              <a
                key={info.label}
                href={info.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border hover:border-primary/30 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <info.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{info.label}</p>
                  <p className="font-medium text-foreground">{info.value}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Contact;