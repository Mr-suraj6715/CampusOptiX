import React, { useState, useEffect, useRef } from 'react';
import { Video, ShieldAlert, Signal, Maximize2, Minimize2, Users } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';

interface LiveVideoPlayerProps {
  roomId: string;
  roomName: string;
  capacity?: number;
  currentStudents?: number;
}

export const LiveVideoPlayer: React.FC<LiveVideoPlayerProps> = ({
  roomId,
  roomName,
  capacity = 0,
  currentStudents = 0,
}) => {
  const { user } = useAuth();
  const isStudent = user?.role === 'STUDENT';
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: false }));
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Privacy blur for students
  const isBlurred = isStudent;

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = Boolean(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const toggleFullScreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if ((containerRef.current as any).webkitRequestFullscreen) {
          await (containerRef.current as any).webkitRequestFullscreen();
        } else if ((containerRef.current as any).mozRequestFullScreen) {
          await (containerRef.current as any).mozRequestFullScreen();
        } else if ((containerRef.current as any).msRequestFullscreen) {
          await (containerRef.current as any).msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      }
    } catch (err) {
      console.error('Fullscreen toggle error:', err);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${isFullscreen ? 'h-screen flex items-center justify-center' : 'aspect-video'} bg-black rounded-xl overflow-hidden shadow-inner border border-slate-800 select-none`}
    >
      {/* Mock Video Stream Background (Animated gradient + noise to simulate feed) */}
      <div 
        className={`absolute inset-0 bg-slate-950 ${isBlurred ? 'blur-xl opacity-60' : ''}`}
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(20, 35, 50, 1) 0%, rgba(5, 10, 15, 1) 100%),
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)
          `,
          backgroundSize: '100% 100%, 100% 4px',
        }}
      >
        {/* Animated scanning line to simulate camera active state */}
        {!isBlurred && (
          <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400/20 shadow-[0_0_8px_rgba(34,211,238,0.5)] animate-[scan_3s_ease-in-out_infinite]" />
        )}
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 p-3 sm:p-5 flex flex-col justify-between text-white font-mono z-10 pointer-events-none">
        {/* Top Bar */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-2.5 py-1 bg-black/75 backdrop-blur-md rounded border border-white/20 shadow-md">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-black text-red-400 tracking-wider">REC</span>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1 bg-black/75 backdrop-blur-md rounded border border-white/20 shadow-md text-xs font-bold text-white">
              <Signal className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-emerald-300">LIVE FEED</span>
            </div>
          </div>
          <div className="px-3 py-1 bg-black/75 backdrop-blur-md rounded border border-white/20 shadow-md text-xs font-bold text-cyan-300 tracking-widest">
            {time}
          </div>
        </div>

        {/* Center - Privacy Warning for Students */}
        {isBlurred && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20 bg-black/40 backdrop-blur-sm">
            <ShieldAlert className="w-14 h-14 text-amber-400 mb-3 animate-bounce" />
            <h3 className="text-xl font-black text-white drop-shadow">Privacy Mode Active</h3>
            <p className="text-sm font-medium text-slate-200 max-w-sm mt-2 leading-relaxed">
              Live video feed is restricted to administrators and faculty for privacy compliance. 
            </p>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="flex justify-between items-end">
          <div className="space-y-1.5">
            <h4 className="text-sm sm:text-base font-black bg-black/75 backdrop-blur-md px-3 py-1 rounded border border-white/20 shadow-md text-white w-fit tracking-wide">
              CAM-{roomId} // {roomName}
            </h4>
            {capacity > 0 && (
              <div className="flex items-center gap-2 px-2.5 py-1 bg-black/75 backdrop-blur-md rounded border border-white/20 shadow-md w-fit text-xs font-bold text-slate-100">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span>Est. Occupancy: <strong className="text-emerald-400">{currentStudents}</strong> / {capacity} seats</span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={toggleFullScreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            className="p-2.5 bg-black/80 hover:bg-blue-600 backdrop-blur-md rounded-lg border border-white/30 hover:border-blue-400 text-white pointer-events-auto transition-all duration-200 cursor-pointer shadow-lg hover:scale-110 active:scale-95"
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5 text-white" />
            ) : (
              <Maximize2 className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(100vh); }
          100% { transform: translateY(-100%); }
        }
      `}</style>
    </div>
  );
};
