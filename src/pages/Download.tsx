import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Smartphone, CheckCircle2, AlertCircle, Shield, Zap } from 'lucide-react';

const DownloadPage = () => {
    const [downloading, setDownloading] = useState(false);

    const handleDownload = () => {
        setDownloading(true);
        // Create a link to download the APK
        const link = document.createElement('a');
        link.href = '/AskAI Chat_1_1.0.apk';
        link.download = 'AskAI Chat_1_1.0.apk';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
            setDownloading(false);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            {/* Header */}
            <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Back to Chat</span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
                        <Smartphone className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold text-foreground mb-4">
                        Download AskAI Chat for Android
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Get the full AskAI Chat experience on your Android device. Chat with AI anytime, anywhere.
                    </p>
                </div>

                {/* Download Button */}
                <div className="flex justify-center mb-16">
                    <button
                        onClick={handleDownload}
                        disabled={downloading}
                        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        <Download className={`w-6 h-6 ${downloading ? 'animate-bounce' : 'group-hover:animate-bounce'}`} />
                        {downloading ? 'Starting Download...' : 'Download APK (v1.0)'}
                    </button>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                            <Zap className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Fast & Lightweight</h3>
                        <p className="text-sm text-muted-foreground">
                            Optimized for performance with minimal storage requirements.
                        </p>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                            <Shield className="w-6 h-6 text-green-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Secure & Private</h3>
                        <p className="text-sm text-muted-foreground">
                            Your conversations are encrypted and stored securely.
                        </p>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                            <Smartphone className="w-6 h-6 text-purple-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Native Experience</h3>
                        <p className="text-sm text-muted-foreground">
                            Enjoy a smooth, native Android app experience.
                        </p>
                    </div>
                </div>

                {/* Installation Guide */}
                <div className="bg-card border border-border rounded-2xl p-8 mb-8">
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                        Installation Guide
                    </h2>

                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                                1
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">Download the APK</h3>
                                <p className="text-sm text-muted-foreground">
                                    Click the download button above to download the AskAI Chat APK file to your device.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                                2
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">Enable Unknown Sources</h3>
                                <p className="text-sm text-muted-foreground mb-2">
                                    Go to <span className="font-medium text-foreground">Settings → Security → Install unknown apps</span> and enable installation from your browser or file manager.
                                </p>
                                <p className="text-xs text-muted-foreground italic">
                                    Note: This setting may vary depending on your Android version.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                                3
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">Install the App</h3>
                                <p className="text-sm text-muted-foreground">
                                    Open the downloaded APK file from your notifications or file manager and tap "Install".
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                                4
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">Launch & Enjoy</h3>
                                <p className="text-sm text-muted-foreground">
                                    Once installed, open AskAI Chat from your app drawer and start chatting!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Important Notice */}
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
                    <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-foreground mb-2">Important Notice</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-500 mt-1">•</span>
                                    <span>This app requires Android 5.0 (Lollipop) or higher.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-500 mt-1">•</span>
                                    <span>Make sure you have a stable internet connection for AI chat functionality.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-500 mt-1">•</span>
                                    <span>The app is currently in beta. Please report any issues to our support team.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* System Requirements */}
                <div className="mt-8 grid md:grid-cols-2 gap-6">
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h3 className="font-semibold text-foreground mb-4">System Requirements</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                Android 5.0 or higher
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                Minimum 50 MB free storage
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                Internet connection required
                            </li>
                        </ul>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-6">
                        <h3 className="font-semibold text-foreground mb-4">App Information</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex justify-between">
                                <span>Version:</span>
                                <span className="font-medium text-foreground">1.0</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Size:</span>
                                <span className="font-medium text-foreground">~15 MB</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Last Updated:</span>
                                <span className="font-medium text-foreground">January 2026</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Support */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                        Need help? Have questions?
                    </p>
                    <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                        Contact Support
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default DownloadPage;
