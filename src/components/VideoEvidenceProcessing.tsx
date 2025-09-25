import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Slider } from "./ui/slider";
import {
  ArrowLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Settings,
  MessageSquare,
  Search,
  Image as ImageIcon,
} from "lucide-react";
import { dataValuesEvidence } from "../data/dataValues";
import { Evidence } from "../types/case";
import GradientHeader from "./common/GradientHeader";
import BackButton from "./common/BackButton";

interface VideoEvidenceProcessingProps {
  evidenceId: string;
  onBack: () => void;
}

type ChatEntry = {
  query: string;
  response: string;
  timestamps: number[];
};

type BoundingBox = {
  time: number;
  coords: [number, number, number, number];
  showForSeconds?: number;
};

function Bubble({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: "query" | "response";
}) {
  const base =
    "relative w-fit max-w-[220px] px-3 py-2 text-sm leading-5 rounded-2xl shadow-sm";
  const styles =
    variant === "query"
      ? "bg-blue-600 text-white shadow-md after:content-[''] after:absolute after:-right-2 after:top-3 after:border-y-8 after:border-y-transparent after:border-l-8 after:border-l-blue-600"
      : "bg-white text-foreground border border-blue-100 after:content-[''] after:absolute after:-left-2 after:top-3 after:border-y-8 after:border-y-transparent after:border-r-8 after:border-r-white";
  return <div className={`${base} ${styles}`}>{children}</div>;
}

export function VideoEvidenceProcessing({
  evidenceId,
  onBack,
}: VideoEvidenceProcessingProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const posterInputRef = useRef<HTMLInputElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [posterUrl, setPosterUrl] = useState<string | undefined>(undefined);
  const [videoSize, setVideoSize] = useState<{ width: number; height: number }>(
    {
      width: 0,
      height: 0,
    }
  );
  const [containerSize, setContainerSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const [chatQuery, setChatQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const HARDCODED_CHATS: ChatEntry[] = [
    {
      query: "Identify girl in pink top, wide leg blue jeans, white sneakers",
      response: "Found person in pink top at following timestamps:",
      timestamps: [398, 613],
    },
    {
      query: "When did she leave the room?",
      response: "Seems like she left at 11:14:15",
      timestamps: [812],
    },
    {
      query: "Show me all people wearing dark clothing",
      response:
        "Detected 3 individuals in dark clothing at the following timestamps:",
      timestamps: [120, 245, 380, 520],
    },
    {
      query: "Find any suspicious activity near the entrance",
      response: "Detected unusual movement patterns at these times:",
      timestamps: [150, 300, 450],
    },
    {
      query: "Identify anyone carrying bags or packages",
      response: "Found 2 individuals with bags at these timestamps:",
      timestamps: [200, 350, 500],
    },
    {
      query: "Show me all vehicles in the parking area",
      response: "Detected 4 vehicles entering and exiting:",
      timestamps: [100, 250, 400, 550],
    },
    {
      query: "Find any interactions between people",
      response: "Detected 5 interaction events:",
      timestamps: [180, 320, 420, 480, 600],
    },
    {
      query: "Show me anyone looking at the camera",
      response: "Found 2 instances of people looking directly at camera:",
      timestamps: [220, 380],
    },
  ];

  const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]);

  const [detectedFlags, setDetectedFlags] = useState<
    { time: number; type: string; label: string; color: string }[]
  >([]);

  const evidence: Evidence | undefined = dataValuesEvidence.find(
    (e) => e.id === evidenceId
  );

  if (!evidence) {
    return <div>Evidence not found</div>;
  }

  const formatTime = (seconds: number) => {
    const totalSeconds = Math.floor(seconds || 0);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const clamp = (val: number, min = 0, max = Number.MAX_SAFE_INTEGER) =>
    Math.min(Math.max(val, min), max);

  const handleSeekToTime = (time: number) => {
    const safe = clamp(time, 0, duration || 0);
    if (videoRef.current) {
      videoRef.current.currentTime = safe;
    }
    setCurrentTime(safe);
  };

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      try {
        await video.play();
      } catch {
        // ignore play rejection
      }
    } else {
      video.pause();
    }
  };

  const seekRelative = (deltaSeconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    const target = clamp(video.currentTime + deltaSeconds, 0, duration || 0);
    video.currentTime = target;
    setCurrentTime(target);
  };

  // Keep local state in sync with the video element
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onLoaded = () => {
      setDuration(video.duration || 0);
      setVideoSize({
        width: video.videoWidth || 0,
        height: video.videoHeight || 0,
      });
    };
    const onTime = () => setCurrentTime(video.currentTime || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);
    return () => {
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
    };
  }, []);

  // Track container size for correct overlay placement with object-contain
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () =>
      setContainerSize({ width: el.clientWidth, height: el.clientHeight });
    update();
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(update);
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, []);

  // Initialize poster from localStorage (persist across sessions)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`poster:${evidenceId}`);
      setPosterUrl(stored || undefined);
    } catch {
      setPosterUrl(undefined);
    }
  }, [evidenceId]);

  const handlePosterFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPosterUrl(dataUrl);
      try {
        localStorage.setItem(`poster:${evidenceId}`, dataUrl);
      } catch {}
    };
    reader.readAsDataURL(file);
    // reset input so re-uploading the same file triggers change
    e.currentTarget.value = "";
  };

  const handleChatSubmit = () => {
    if (!chatQuery.trim() || isLoading) return;

    setIsLoading(true);
    const nextIndex = chatHistory.length;
    const predefined = HARDCODED_CHATS[nextIndex];

    // Add 3-second delay before showing the response
    setTimeout(() => {
      if (predefined) {
        setChatHistory((prev) => [...prev, predefined]);
        // When a predefined result is appended, surface its timestamps as flags
        // Color palette for different messages
        const colorPalette = [
          "bg-red-500", // First message - red
          "bg-orange-500", // Second message - orange
          "bg-blue-500", // Third message - blue
          "bg-green-500", // Fourth message - green
          "bg-purple-500", // Fifth message - purple
          "bg-pink-500", // Sixth message - pink
          "bg-yellow-500", // Seventh message - yellow
          "bg-indigo-500", // Eighth message - indigo
          "bg-teal-500", // Ninth message - teal
          "bg-cyan-500", // Tenth message - cyan
        ];
        const color = colorPalette[nextIndex] || "bg-gray-500";
        const label = `Result ${nextIndex + 1}`;
        const newFlags = predefined.timestamps.map((t) => ({
          time: t,
          type: "person",
          label,
          color,
        }));
        setDetectedFlags((prev) =>
          [...prev, ...newFlags]
            .sort((a, b) => a.time - b.time)
            .filter(
              (flag, idx, arr) =>
                arr.findIndex(
                  (f) => f.time === flag.time && f.color === flag.color
                ) === idx
            )
        );
      } else {
        // Optional: append a simple echo if more queries are made
        setChatHistory((prev) => [
          ...prev,
          {
            query: chatQuery,
            response: "No preset result for this query.",
            timestamps: [],
          },
        ]);
      }
      setChatQuery("");
      setIsLoading(false);
    }, 3000);
  };

  const handleImageUpload = () => {
    // Mock image upload for person detection
    const newDetection = {
      time: currentTime + 30,
      type: "person",
      label: "Uploaded person match",
      color: "bg-primary",
    };
    setDetectedFlags((prev) =>
      [...prev, newDetection].sort((a, b) => a.time - b.time)
    );
  };

  return (
    <div className="flex h-full bg-background space-x-3 p-3">
      {/* Chat Panel */}
      <div className="w-80 bg-gradient-to-b from-blue-50 to-blue-100/40 border-r flex flex-col h-full">
        <div className="p-4 flex-shrink-0">
          <h3 className="font-medium flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-blue-600" />
            Video Analysis
          </h3>
          <p className="text-[11px] text-muted-foreground mt-1">
            Search for people, objects, or activities
          </p>
        </div>

        <ScrollArea className="flex-1 px-3 pb-3 min-h-0">
          <div className="space-y-4">
            {chatHistory.map((chat, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-end">
                  <Bubble variant="query">{chat.query}</Bubble>
                </div>

                <div className="flex justify-start">
                  <Bubble variant="response">
                    <div>{chat.response}</div>
                    {chat.timestamps.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {chat.timestamps.map((timestamp, idx) => (
                          <Button
                            key={idx}
                            variant="link"
                            size="sm"
                            className="p-0 h-auto text-blue-200 underline"
                            onClick={() => handleSeekToTime(timestamp)}
                          >
                            {formatTime(timestamp)}
                          </Button>
                        ))}
                      </div>
                    )}
                  </Bubble>
                </div>
              </div>
            ))}

            {/* Loading state */}
            {isLoading && (
              <div className="space-y-2">
                <div className="flex justify-end">
                  <Bubble variant="query">{chatQuery}</Bubble>
                </div>
                <div className="flex justify-start">
                  <Bubble variant="response">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
                      <span className="text-muted-foreground">
                        Intelligence analysis...
                      </span>
                    </div>
                  </Bubble>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-3 border-t flex-shrink-0 bg-gradient-to-t from-blue-50/60 to-transparent space-y-3">
          {/* Image Upload */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Upload image to detect:
            </label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleImageUpload}
              >
                <ImageIcon className="h-3 w-3 mr-1" />
                Upload Image
              </Button>
            </div>
          </div>

          {/* Text Query */}
          <div>
            <div className="flex gap-2">
              <Input
                placeholder="Ask about evidence..."
                value={chatQuery}
                onChange={(e) => setChatQuery(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && !isLoading && handleChatSubmit()
                }
                className="flex-1 h-9 rounded-md bg-white"
                disabled={isLoading}
              />
              <Button
                size="sm"
                onClick={handleChatSubmit}
                disabled={isLoading || !chatQuery.trim()}
                className="h-9 px-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                ) : (
                  "Send"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player Area */}
      <div className="flex-1 flex flex-col bg-card rounded-lg">
        {/* Header */}
        <div className="border-b p-6 pt-8 flex flex-col">
          <BackButton onBack={onBack} location="Case" />
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <GradientHeader title={evidence.name} />
              <p className="text-base text-muted-foreground">
                {evidence.description} • {evidence.fileSize}
              </p>
            </div>
          </div>
        </div>

        {/* Video Content */}
        <div className="flex-1 flex flex-col p-4 pb-0">
          {/* Video Player */}
          <div
            className="bg-black rounded-lg relative overflow-hidden h-[60vh] mb-6"
            ref={containerRef}
          >
            <video
              ref={videoRef}
              src={"https://evidenx.s3.us-east-1.amazonaws.com/CCTV_Master.mp4"}
              poster={posterUrl || evidence.thumbnail}
              className="absolute inset-0 w-full h-full object-contain bg-black"
              muted={isMuted}
              playsInline
              preload="metadata"
            />
            {/* Bounding box overlay near 398s */}
            {(() => {
              const boxes: BoundingBox[] = [
                {
                  time: 398,
                  coords: [693.59, 36.56, 1002.14, 335.39],
                  showForSeconds: 1,
                },
                {
                  time: 613,
                  coords: [1293.59, 136.56, 1602.14, 635.39],
                  showForSeconds: 1,
                },
                {
                  time: 812,
                  coords: [693.59, 36.56, 1002.14, 335.39],
                  showForSeconds: 1,
                },
              ];
              const visible = boxes.filter(
                (b) =>
                  Math.abs(currentTime - b.time) <= (b.showForSeconds ?? 1) / 2
              );
              if (
                !visible.length ||
                !videoSize.width ||
                !videoSize.height ||
                !containerSize.width ||
                !containerSize.height
              ) {
                return null;
              }
              const scale = Math.min(
                containerSize.width / videoSize.width,
                containerSize.height / videoSize.height
              );
              const displayWidth = videoSize.width * scale;
              const displayHeight = videoSize.height * scale;
              const offsetX = (containerSize.width - displayWidth) / 2;
              const offsetY = (containerSize.height - displayHeight) / 2;
              return (
                <div className="absolute inset-0 pointer-events-none">
                  {visible.map((b, i) => {
                    const [x1, y1, x2, y2] = b.coords;
                    const left =
                      offsetX + (x1 / videoSize.width) * displayWidth;
                    const top =
                      offsetY + (y1 / videoSize.height) * displayHeight;
                    const width = ((x2 - x1) / videoSize.width) * displayWidth;
                    const height =
                      ((y2 - y1) / videoSize.height) * displayHeight;
                    return (
                      <div
                        key={i}
                        className="absolute"
                        style={{
                          left,
                          top,
                          width,
                          height,
                          border: "2px solid #39FF14",
                          backgroundColor: "rgba(57,255,20,0.12)",
                          boxShadow:
                            "0 0 10px 2px rgba(57,255,20,0.8), inset 0 0 0 2px rgba(57,255,20,0.5)",
                        }}
                      />
                    );
                  })}
                </div>
              );
            })()}
            {/* Play overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Button
                size="lg"
                className="rounded-full w-16 h-16 pointer-events-auto"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Video Controls */}
          <div className="space-y-2 mt-4 mb-0">
            {/* Timeline with slider and flags */}
            <div className="relative ml-4 mt-2">
              <Slider
                value={[currentTime]}
                min={0}
                max={Math.max(duration, 0.01)}
                step={0.1}
                onValueChange={(v) => handleSeekToTime(v[0] ?? 0)}
                aria-label="Seek"
                className="h-4"
                trackClassName="!bg-muted !h-3 "
                rangeClassName="!bg-primary-2"
                thumbClassName="!border-blue-700 !bg-blue-700 rounded-full h-3"
              />
              {/* Detection flags overlay */}
              {duration > 0 && (
                <div className="pointer-events-none absolute inset-0 -top-5">
                  {detectedFlags.map((flag, index) => (
                    <button
                      key={index}
                      className={`pointer-events-auto absolute top-1/2 w-3 h-3 rounded-full ${flag.color} -translate-y-1/2 -translate-x-1.5 hover:scale-125 transition-transform`}
                      style={{ left: `${(flag.time / duration) * 100}%` }}
                      onClick={() => handleSeekToTime(flag.time)}
                      title={`${flag.label} - ${formatTime(flag.time)}`}
                    />
                  ))}
                </div>
              )}
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => seekRelative(-5)}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={togglePlay}>
                {isPlaying ? (
                  <Pause className="h-4 w-4 opacity-30" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => seekRelative(5)}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMuted((m) => !m)}
              >
                <Volume2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              {/* Set thumbnail from image */}
              <input
                ref={posterInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePosterFileChange}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => posterInputRef.current?.click()}
                title="Set thumbnail image"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
