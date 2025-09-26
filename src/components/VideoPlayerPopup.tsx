import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  X,
} from "lucide-react";
import { Slider } from "./ui/slider";

interface VideoPlayerPopupProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  seekToTimestamp?: number; // in seconds
  title?: string;
  evidenceId?: string;
}

export function VideoPlayerPopup({
  isOpen,
  onClose,
  videoUrl = "https://evidenx.s3.us-east-1.amazonaws.com/CCTV_Master.mp4", // Sample video
  seekToTimestamp,
  title = "Evidence Video",
  evidenceId,
}: VideoPlayerPopupProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Seek to timestamp when popup opens
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isOpen && seekToTimestamp !== undefined) {
      const handleLoadedMetadata = () => {
        video.currentTime = seekToTimestamp;
        video.play().catch((e) => console.log("Play error:", e));
        setIsPlaying(true);
      };

      if (video.readyState >= 1) {
        // Metadata already loaded
        handleLoadedMetadata();
      } else {
        // Wait for metadata
        video.addEventListener("loadedmetadata", handleLoadedMetadata, {
          once: true,
        });
      }
    } else if (!isOpen) {
      // Reset when popup closes
      video.pause();
      video.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [isOpen, seekToTimestamp]);

  // Update time and duration
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
    };
  }, [isOpen]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = value[0];
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume > 0 ? volume : 0.5;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const skipTime = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(
      0,
      Math.min(duration, video.currentTime + seconds)
    );
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!document.fullscreenElement) {
      video.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getTimestampBadge = () => {
    if (seekToTimestamp !== undefined) {
      return (
        <Badge variant="secondary" className="mb-2">
          Jumped to: {formatTime(seekToTimestamp)}
        </Badge>
      );
    }
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full h-[80vh] p-0 overflow-hidden rounded-lg p-2 ">
        <DialogHeader className=" justify-between p-4 border-b border-gray-700">
          <div className="flex flex-col gap-2 justify-between">
            <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
            {evidenceId && (
              <p className="text-sm text-gray-400 mt-1">
                Evidence ID: {evidenceId}
              </p>
            )}
            {seekToTimestamp !== undefined && (
              <Badge variant="secondary" className="mt-1">
                Jumped to: {formatTime(seekToTimestamp)}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="relative flex-1 flex items-center justify-center rounded-lg">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain bg-black rounded-lg"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          />

          {/* Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 flex flex-col gap-3">
            {/* Progress */}
            <div>
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={0.1}
                onValueChange={handleSeek}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-white mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Play / Pause */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlayPause}
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>

                {/* Skip */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => skipTime(-10)}
                  className="flex items-center gap-1 text-white hover:bg-white/20"
                >
                  <RotateCcw className="h-4 w-4" />{" "}
                  <span className="text-xs">10s</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => skipTime(10)}
                  className="flex items-center gap-1 text-white hover:bg-white/20"
                >
                  <RotateCw className="h-4 w-4" />{" "}
                  <span className="text-xs">10s</span>
                </Button>

                {/* Volume */}
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={1}
                    step={0.05}
                    onValueChange={handleVolumeChange}
                    className="w-24"
                  />
                </div>
              </div>

              {/* Fullscreen */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
