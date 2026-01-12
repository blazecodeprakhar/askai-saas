import { Link, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Home, ArrowLeft, Ghost } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - left - width / 2) / 25;
        const y = (e.clientY - top - height / 2) / 25;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] opacity-20 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px] opacity-20 animate-pulse delay-700" />

      {/* Main Container with Tilt Effect */}
      <div
        ref={containerRef}
        className="relative z-10 max-w-lg w-full"
        style={{
          transform: `perspective(1000px) rotateY(${mousePosition.x}deg) rotateX(${-mousePosition.y}deg)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        <div className="bg-card/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden relative group">

          {/* Spotlight Effect */}
          <div
            className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${50 + mousePosition.x * 2}% ${50 + mousePosition.y * 2}%, rgba(255,255,255,0.03), transparent 70%)`
            }}
          />

          <div className="text-center relative z-10">
            {/* Animated 404 Icon */}
            <div className="relative mx-auto w-32 h-32 mb-8 group-hover:scale-110 transition-transform duration-500">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              <div className="relative w-full h-full bg-background/50 border border-white/10 rounded-2xl flex items-center justify-center shadow-inner">
                <span className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary via-white to-primary/50 select-none">
                  4
                </span>
                <Ghost className="w-16 h-16 text-primary mx-1 animate-bounce" />
                <span className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary via-white to-primary/50 select-none">
                  4
                </span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
              Page Not Found
            </h1>

            <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
              It seems you've ventured into the unknown. The page you are looking for has vanished or never existed.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-primary/20 group/btn"
              >
                <Home className="w-5 h-5 group-hover/btn:-translate-y-1 transition-transform" />
                Return Home
              </Link>

              <button
                onClick={() => window.history.back()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-foreground font-semibold hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-200 backdrop-blur-sm group/back"
              >
                <ArrowLeft className="w-5 h-5 group-hover/back:-translate-x-1 transition-transform" />
                Go Back
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Floating Elements */}
        <div
          className="absolute -top-12 -right-12 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-pulse"
          style={{ transform: `translate(${mousePosition.x * -2}px, ${mousePosition.y * -2}px)` }}
        />
        <div
          className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-300"
          style={{ transform: `translate(${mousePosition.x * -2}px, ${mousePosition.y * -2}px)` }}
        />
      </div>
    </div>
  );
};

export default NotFound;
