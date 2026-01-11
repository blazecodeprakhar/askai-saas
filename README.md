# AskAI Chat Companion

![AskAI Chat](public/favicojn.png)

A professional, full-featured AI chat application built with React, TypeScript, and Supabase. AskAI Chat integrates Google Gemini AI for intelligent conversations and supports advanced document processing, enabling users to chat with their images, PDFs, and text files.

## 🌟 Key Features

### 🤖 Intelligent Chat
- **Google Gemini Pro Integration**: Powered by Google's state-of-the-art multimodal AI.
- **Real-time Streaming**: Responses appear token-by-token for a natural conversational feel.
- **Context Awareness**: Maintains conversation history for coherent multi-turn dialogues.
- **Guest & User Modes**: Try instantly as a guest or sign up for persistent history.

### 📄 Advanced Document Processing
The application processes files **client-side** to extract text before sending it to the AI.
- **Images (OCR)**: Uses `Tesseract.js` to extract text from screenshots, scanned documents, and photos.
- **PDF Support**: Uses `PDF.js` to extract text from PDF documents.
- **Text Files**: Directly reads `.txt`, `.csv`, `.json`, and code files.
- **Multi-file Support**: Upload and analyze multiple documents simultaneously.
- **Privacy Focused**: Raw files are processed locally in the browser; only the extracted text is sent to the AI API.

### 🔒 Secure Architecture
- **Authentication**: Email/Password and Guest authentication via Supabase Auth.
- **Database**: PostgreSQL with Row Level Security (RLS) ensuring data isolation.
- **Environment Security**: API keys and secrets managed via generic proxy or environment variables (never exposed to client).

### 📧 Contact System
- **Integrated Contact Form**: Fully functional "Get in Touch" form.
- **Web3Forms Integration**: Submissions are sent directly to your email.
- **Professional Formatting**: Emails include custom subject lines and clear sender identification.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn/UI (Radix Primitives)
- **Icons**: Lucide React
- **Backend & Auth**: Supabase (PostgreSQL, GoTrue)
- **AI Model**: Google Gemini Pro (via API)
- **Document Processing**:
  - `tesseract.js` (Image OCR)
  - `pdfjs-dist` (PDF Parsing)
- **Form Handling**: Web3Forms

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd askai-companion
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory with the following variables:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    # Note: Gemini API key should be handled via a secure backend proxy or edge function in production
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Access the app at `http://localhost:8080` (or the port shown in terminal).

### Building for Production
```bash
npm run build
```
This generates a static `dist` folder ready for deployment on Vercel, Netlify, or any static host.

---

## 📂 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── chat/            # Chat-specific components (Input, Message List)
│   ├── layout/          # Layout components (Navbar, Footer)
│   └── ui/              # Shadcn UI primitives (Buttons, Inputs, etc.)
├── hooks/               # Custom React hooks (useChat, useAuth)
├── lib/                 # Utility functions
│   ├── documentProcessor.ts  # Core document processing logic
│   └── supabase.ts           # Supabase client configuration
├── pages/               # Route components (Index, About, Contact)
├── App.tsx              # Main application root
└── main.tsx             # Entry point
```

---

## 📖 Feature Documentation

### Document Processing
The `src/lib/documentProcessor.ts` file handles file uploads. It determines the file type and routes it to the correct extraction method:
- **Images**: Passed to Tesseract worker for Optical Character Recognition.
- **PDFs**: Parsed page-by-page using PDF.js to extract text layers.
- **Text**: Read directly using the File API.

The extracted text is combined with the user's prompt and sent to Gemini, allowing the AI to "read" the documents.

### Contact Form
The `src/pages/Contact.tsx` component handles user inquiries. It uses `Web3Forms` to send emails without requiring a backend mail server.
- **Access Key**: Configured in the component.
- **Customization**: Adds "Subject" and "From Name" fields for professional email delivery.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.
