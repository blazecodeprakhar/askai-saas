import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Smartphone, CheckCircle2, Share, PlusSquare, Zap, Shield, Sparkles } from 'lucide-react';

const DownloadPage = () => {
    const [installPrompt, setInstallPrompt] = useState<any>(null);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        // Check if running in standalone mode (already installed)
        const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone === true;
        setIsStandalone(isStandaloneMode);

        // Detect iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        setIsIOS(/iphone|ipad|ipod/.test(userAgent));

        // Capture install prompt
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setInstallPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!installPrompt) return;
        installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;
        if (outcome === 'accepted') {
            setInstallPrompt(null);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Header */}
            <header className="border-b border-white/5 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Back to Chat</span>
                    </Link>
                    <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">AskAI</span>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 flex flex-col items-center">

                {/* Hero Section */}
                <div className="text-center mb-12 space-y-6 animate-fade-in">

                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Install <span className="text-primary">AskAI Chat</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-lg mx-auto">
                        Get the native app experience. Launches instantly, works full-screen, and looks stunning on any device.
                    </p>
                </div>

                {isStandalone ? (
                    <div className="w-full max-w-md bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center animate-fade-in">
                        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-green-500 mb-2">AskAI is Installed</h2>
                        <p className="text-sm text-muted-foreground">
                            You are currently running the full version of AskAI Chat.
                        </p>
                    </div>
                ) : (
                    <div className="w-full max-w-md space-y-8 animate-slide-up">
                        {/* Install Button (Android/Desktop) */}
                        {!isIOS && (
                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={handleInstallClick}
                                    disabled={!installPrompt}
                                    className="w-full relative group overflow-hidden rounded-2xl bg-primary px-8 py-5 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                    <div className="relative flex items-center justify-center gap-3">
                                        <Smartphone className="w-6 h-6 text-primary-foreground" />
                                        <span className="font-bold text-lg text-primary-foreground">
                                            {installPrompt ? 'Install App Now' : 'Install App'}
                                        </span>
                                    </div>
                                </button>
                                {!installPrompt && (
                                    <p className="text-xs text-center text-muted-foreground">
                                        If the button is disabled, AskAI might already be installed or check your browser menu to install manually.
                                    </p>
                                )}
                            </div>
                        )}

                        {/* iOS Instructions */}
                        {isIOS && (
                            <div className="bg-card/50 backdrop-blur border border-white/10 rounded-2xl p-6 space-y-4">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <Smartphone className="w-5 h-5" />
                                    Install on iOS
                                </h3>
                                <div className="space-y-4 text-sm text-muted-foreground">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-medium text-xs">1</div>
                                        <p>Tap the <Share className="w-4 h-4 inline mx-1" /> <span className="text-foreground font-medium">Share</span> button in Safari.</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-medium text-xs">2</div>
                                        <p>Scroll down and tap <span className="text-foreground font-medium">Add to Home Screen</span> <PlusSquare className="w-4 h-4 inline mx-1" />.</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-medium text-xs">3</div>
                                        <p>Tap <span className="text-foreground font-medium">Add</span> in the top right corner.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-16 text-left">
                    <div className="p-6 rounded-2xl bg-card/30 border border-white/5 hover:bg-card/50 transition-colors">
                        <Zap className="w-8 h-8 text-yellow-400 mb-4" />
                        <h3 className="font-semibold text-foreground mb-2">Instant Load</h3>
                        <p className="text-sm text-muted-foreground">Launches instantly, even on slow networks. Powered by Service Worker caching.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-card/30 border border-white/5 hover:bg-card/50 transition-colors">
                        <Shield className="w-8 h-8 text-green-400 mb-4" />
                        <h3 className="font-semibold text-foreground mb-2">100% Secure</h3>
                        <p className="text-sm text-muted-foreground">Runs in a secure sandbox. No dangerous permissions required.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-card/30 border border-white/5 hover:bg-card/50 transition-colors">
                        <Smartphone className="w-8 h-8 text-blue-400 mb-4" />
                        <h3 className="font-semibold text-foreground mb-2">Native Feel</h3>
                        <p className="text-sm text-muted-foreground">No address bar. Full-screen immersive experience on your home screen.</p>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default DownloadPage;
