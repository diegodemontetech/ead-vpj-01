import React from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Loader } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
}

export function VideoPlayer({ src, poster, onProgress, onComplete }: VideoPlayerProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
      onProgress?.(progress);

      if (progress >= 95 && !isPlaying) {
        onComplete?.();
      }
    }
  };

  const handleLoadStart = () => {
    setIsLoading(true);
    setError(null);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError('Erro ao carregar o vídeo. Tente novamente mais tarde.');
  };

  return (
    <div className="relative group">
      <video
        ref={videoRef}
        className="w-full aspect-video bg-black rounded-lg"
        poster={poster}
        onTimeUpdate={handleTimeUpdate}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onError={handleError}
      >
        <source src={src} type="video/mp4" />
        Seu navegador não suporta a reprodução de vídeos.
      </video>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader className="w-8 h-8 text-white animate-spin" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white text-center">
            <p className="mb-2">{error}</p>
            <button
              onClick={() => videoRef.current?.load()}
              className="px-4 py-2 bg-[#E50914] rounded-lg hover:bg-[#B81D24] transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Progress Bar */}
        <div className="relative w-full h-1 bg-gray-600 rounded-full mb-4 cursor-pointer">
          <div
            className="absolute h-full bg-[#E50914] rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlay}
              className="p-2 text-white hover:text-[#E50914] transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </button>

            <button
              onClick={toggleMute}
              className="p-2 text-white hover:text-[#E50914] transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-6 h-6" />
              ) : (
                <Volume2 className="w-6 h-6" />
              )}
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-2 text-white hover:text-[#E50914] transition-colors"
          >
            <Maximize className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}