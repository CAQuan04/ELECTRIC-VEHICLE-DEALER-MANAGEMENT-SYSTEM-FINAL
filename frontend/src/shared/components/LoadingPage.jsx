import React from 'react';

const LoadingPage = ({ 
  message = "Đang tải...", 
  showLogo = true, 
  variant = "default" // "default", "minimal", "full-screen"
}) => {
  const containerClass = 
    variant === "minimal" 
      ? "flex flex-col items-center justify-center min-h-[200px] bg-transparent"
      : variant === "full-screen"
      ? "fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black backdrop-blur-lg"
      : "flex flex-col items-center justify-center min-h-screen bg-black relative overflow-hidden";

  return (
    <div className={containerClass}>
      {/* Background Overlay Effect */}
      {variant !== "minimal" && (
        <div className="absolute inset-0 bg-gradient-radial from-white/10 to-transparent pointer-events-none" />
      )}

      <div className="flex flex-col items-center gap-8 text-center z-10">
        {/* Logo Section */}
        {showLogo && (
          <div className="flex flex-col items-center gap-4">
            <div className="text-emerald-400 animate-pulse">
              <svg 
                width="120" 
                height="120" 
                viewBox="0 0 100 100" 
                fill="none"
                className="drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]"
              >
                <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
                <path
                  d="M30 35h40M25 45h50M20 55h60M35 65h30"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="animate-[charge_1.5s_ease-in-out_infinite]"
                />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="15" 
                  fill="currentColor" 
                  className="animate-[glow_2s_ease-in-out_infinite_alternate]"
                />
              </svg>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent animate-[textGlow_3s_ease-in-out_infinite]">
              EVM
            </h2>
          </div>
        )}
        
        {/* Spinner Animation */}
        <div className="relative w-20 h-20">
          {/* Ring 1 */}
          <div className="absolute inset-0 border-[3px] border-transparent border-t-emerald-400 rounded-full animate-spin" 
               style={{ animationDuration: '2s' }} />
          {/* Ring 2 */}
          <div className="absolute inset-0 border-[3px] border-transparent border-r-cyan-400 rounded-full animate-spin" 
               style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
          {/* Ring 3 */}
          <div className="absolute inset-0 border-[3px] border-transparent border-b-red-400 rounded-full animate-spin" 
               style={{ animationDuration: '4s' }} />
        </div>
        
        {/* Loading Text */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-xl font-medium text-white/80">
            {message}
          </p>
          <div className="flex gap-1">
            <span className="text-2xl font-bold animate-[bounce_1.4s_ease-in-out_-0.32s_infinite_both]">.</span>
            <span className="text-2xl font-bold animate-[bounce_1.4s_ease-in-out_-0.16s_infinite_both]">.</span>
            <span className="text-2xl font-bold animate-[bounce_1.4s_ease-in-out_0s_infinite_both]">.</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-52 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-[progress_2s_ease-in-out_infinite]" />
        </div>
      </div>

      <style jsx>{`
        @keyframes charge {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes glow {
          0% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        @keyframes textGlow {
          0%, 100% { text-shadow: 0 0 10px rgba(16, 185, 129, 0.5); }
          50% { text-shadow: 0 0 20px rgba(16, 185, 129, 0.8), 0 0 30px rgba(6, 182, 212, 0.5); }
        }
        @keyframes progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

// Variant cho loading inline (không full screen)
export const LoadingSpinner = ({ size = "medium", color = "primary" }) => {
  const sizeClass = 
    size === "small" ? "w-5 h-5" : 
    size === "large" ? "w-10 h-10" : 
    "w-8 h-8";

  const colorClass = 
    color === "secondary" ? "border-t-cyan-400" :
    color === "white" ? "border-t-white" :
    "border-t-emerald-400";

  return (
    <div className="inline-flex items-center justify-center">
      <div className={`${sizeClass} border-2 border-transparent ${colorClass} rounded-full animate-spin`} />
    </div>
  );
};

// Variant cho loading button
export const LoadingButton = ({ children, loading, ...props }) => {
  return (
    <button 
      {...props} 
      disabled={loading} 
      className={`relative px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-400 text-white font-semibold 
                  transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(16,185,129,0.3)]
                  disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0
                  ${props.className || ''} ${loading ? 'pointer-events-none' : ''}`}
    >
      {loading && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </span>
      )}
      <span className={loading ? 'opacity-0' : ''}>{children}</span>
    </button>
  );
};

export default LoadingPage;