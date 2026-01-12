import PageLayout from '@/components/layout/PageLayout';
import { Bot, Zap, Shield, Heart, MessageSquare, Database, Lock, Gamepad2, Users, Code, Server, Cpu, Globe, FileText, Image, Layers, Sparkles } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Conversations',
      description: 'Powered by Google Gemini AI for intelligent, context-aware conversations that understand and respond naturally.',
    },
    {
      icon: Zap,
      title: 'Real-Time Streaming',
      description: 'Watch responses appear word-by-word with live streaming for a natural, engaging chat experience.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Enterprise-grade security with encrypted data, secure authentication, and protected API communications.',
    },
    {
      icon: Database,
      title: 'Persistent History',
      description: 'Your conversations are saved securely so you can continue where you left off anytime.',
    },
    {
      icon: FileText,
      title: 'Document Understanding',
      description: 'Upload PDFs, PowerPoint, Word documents, and images. AI extracts and understands content with OCR support.',
    },
    {
      icon: Users,
      title: 'Guest & User Modes',
      description: 'Try instantly as a guest with limited messages, or sign up for unlimited access and saved history.',
    },
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'User Interface',
      description: 'Built with React, TypeScript, and Tailwind CSS. The chat interface handles message input, file uploads, displays conversations, and manages user sessions.',
    },
    {
      step: '2',
      title: 'Authentication',
      description: 'Secure email/password authentication powered by the backend. Users can sign up, log in, or try as guests with message limits.',
    },
    {
      step: '3',
      title: 'Document Processing',
      description: 'When you upload documents or images, our system extracts text using OCR, preserves structure, and sends context to the AI.',
    },
    {
      step: '4',
      title: 'Message Processing',
      description: 'Messages go to secure backend functions that validate input, add context from uploaded files, and forward to the AI.',
    },
    {
      step: '5',
      title: 'AI Response',
      description: 'Google Gemini processes your message with custom system prompts that define AskAI\'s personality and capabilities.',
    },
    {
      step: '6',
      title: 'Data Storage',
      description: 'Conversations are securely stored with Row Level Security ensuring only you can access your chats.',
    },
  ];

  const techStack = {
    frontend: [
      { name: 'React 18', desc: 'Modern UI library with hooks, concurrent features, and efficient rendering' },
      { name: 'TypeScript 5', desc: 'Static type checking for enhanced developer experience and code quality' },
      { name: 'Tailwind CSS', desc: 'Utility-first CSS framework for rapid, responsive UI development' },
      { name: 'Vite', desc: 'Next-generation frontend tooling with instant HMR and optimized builds' },
      { name: 'React Router', desc: 'Declarative routing with protected routes and navigation guards' },
      { name: 'React Query', desc: 'Powerful data fetching with caching, background updates, and stale-while-revalidate' },
    ],
    backend: [
      { name: 'Supabase (Auth, DB, Storage)', desc: 'Managed backend infrastructure with auto-scaling and global distribution' },
      { name: 'Edge Functions', desc: 'Serverless TypeScript/Deno functions running at the edge for low latency' },
      { name: 'PostgreSQL', desc: 'Enterprise-grade relational database with ACID compliance and JSON support' },
      { name: 'Row Level Security', desc: 'Database-level access control ensuring data isolation per user' },
      { name: 'Real-time Subscriptions', desc: 'WebSocket-based live updates for instant data synchronization' },
    ],
    ai: [
      { name: 'Google Gemini', desc: 'State-of-the-art multimodal AI for text, images, and document understanding' },
      { name: 'Vision API', desc: 'Advanced OCR and image analysis for document text extraction' },
      { name: 'Streaming Responses', desc: 'Server-Sent Events (SSE) for real-time token-by-token output' },
      { name: 'Context Management', desc: 'Intelligent conversation history handling with token optimization' },
    ],
    security: [
      { name: 'JWT Authentication', desc: 'Industry-standard token-based auth with secure session management' },
      { name: 'HTTPS/TLS 1.3', desc: 'End-to-end encryption for all data in transit' },
      { name: 'Input Validation', desc: 'Comprehensive server-side validation to prevent injection attacks' },
      { name: 'Secrets Management', desc: 'Secure environment variable handling with no exposed credentials' },
    ],
  };

  return (
    <PageLayout title="About AskAI Chat">
      <div className="space-y-12">
        {/* Introduction */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Welcome to AskAI Chat</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            AskAI Chat is a production-ready, full-stack AI chat application that brings the power of advanced language models
            to your fingertips. Whether you need help with coding, creative writing, document analysis, learning new concepts,
            or just want to have an engaging conversation — AskAI is here for you.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Built with modern web technologies and designed for speed, security, and simplicity, AskAI Chat
            provides a seamless experience across all devices with persistent conversation history, document understanding,
            and intelligent context management.
          </p>
        </section>

        {/* Features Grid */}
        <section>
          <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Key Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-5 rounded-xl bg-muted/30 border border-border hover:border-primary/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-primary/20">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section>
          <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            How It Works
          </h3>
          <div className="space-y-4">
            {howItWorks.map((item) => (
              <div
                key={item.step}
                className="flex gap-4 p-5 rounded-xl bg-muted/20 border border-border"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">{item.step}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Detailed Technology Stack */}
        <section>
          <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            Technology Stack
          </h3>

          {/* Frontend */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <h4 className="font-medium text-foreground">Frontend Technologies</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {techStack.frontend.map((tech) => (
                <div key={tech.name} className="p-4 rounded-lg bg-muted/20 border border-border hover:border-primary/20 transition-colors">
                  <p className="font-medium text-foreground text-sm mb-1">{tech.name}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tech.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Backend */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Server className="w-4 h-4 text-muted-foreground" />
              <h4 className="font-medium text-foreground">Backend Infrastructure</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {techStack.backend.map((tech) => (
                <div key={tech.name} className="p-4 rounded-lg bg-muted/20 border border-border hover:border-primary/20 transition-colors">
                  <p className="font-medium text-foreground text-sm mb-1">{tech.name}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tech.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-4 h-4 text-muted-foreground" />
              <h4 className="font-medium text-foreground">AI & Machine Learning</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {techStack.ai.map((tech) => (
                <div key={tech.name} className="p-4 rounded-lg bg-muted/20 border border-border hover:border-primary/20 transition-colors">
                  <p className="font-medium text-foreground text-sm mb-1">{tech.name}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tech.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-muted-foreground" />
              <h4 className="font-medium text-foreground">Security & Compliance</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {techStack.security.map((tech) => (
                <div key={tech.name} className="p-4 rounded-lg bg-muted/20 border border-border hover:border-primary/20 transition-colors">
                  <p className="font-medium text-foreground text-sm mb-1">{tech.name}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tech.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="p-6 rounded-xl bg-primary/5 border border-primary/20">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            Security & Privacy Commitment
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>All API keys and secrets are stored securely in environment variables, never exposed in code</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Comprehensive input validation on all user messages and file uploads</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Row Level Security ensures complete data isolation between users</span>
              </li>
            </ul>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Secure authentication with encrypted password storage using bcrypt</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>HTTPS/TLS 1.3 encryption for all data in transit</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Regular security audits and vulnerability scanning</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Developer */}
        <section className="pt-6 border-t border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            The Developer
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            AskAI Chat is designed, developed, and maintained by{' '}
            <span className="text-primary font-medium">Prakhar Yadav</span> — a passionate full-stack developer
            dedicated to building innovative, user-friendly applications that make technology accessible to everyone.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Visit{' '}
            <a
              href="https://prakharcodes.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              prakharcodes.netlify.app
            </a>{' '}
            to explore more projects and get in touch.
          </p>
        </section>
      </div>
    </PageLayout>
  );
};

export default About;