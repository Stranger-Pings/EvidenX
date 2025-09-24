import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
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
  Flag,
  User,
  Zap,
} from "lucide-react";
import { mockEvidence } from "../data/mockData";
import { Evidence } from "../types/case";
import { ImageWithFallback } from "./common/ImageWithFallback";

interface VideoEvidenceProcessingProps {
  evidenceId: string;
  onBack: () => void;
}

export function VideoEvidenceProcessing({
  evidenceId,
  onBack,
}: VideoEvidenceProcessingProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(125); // Mock current time in seconds
  const [duration] = useState(9255); // Mock duration in seconds (2:34:15)
  const [chatQuery, setChatQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      query: "Find person in red jacket",
      response: "Found person in red jacket at following timestamps:",
      timestamps: [45, 128, 267, 445],
    },
    {
      query: "When do the suspects appear?",
      response: "Two suspects visible in the following segments:",
      timestamps: [125, 189, 234],
    },
  ]);
  const [detectedFlags, setDetectedFlags] = useState([
    {
      time: 45,
      type: "person",
      label: "Person in red jacket",
      color: "bg-red-500",
    },
    { time: 125, type: "person", label: "Suspect 1", color: "bg-orange-500" },
    { time: 189, type: "person", label: "Suspect 2", color: "bg-orange-500" },
    {
      time: 234,
      type: "activity",
      label: "Suspicious activity",
      color: "bg-yellow-500",
    },
    {
      time: 267,
      type: "person",
      label: "Person in red jacket",
      color: "bg-red-500",
    },
    {
      time: 445,
      type: "person",
      label: "Person in red jacket",
      color: "bg-red-500",
    },
  ]);

  const evidence: Evidence | undefined = mockEvidence.find(
    (e) => e.id === evidenceId
  );

  if (!evidence) {
    return <div>Evidence not found</div>;
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSeekToTime = (time: number) => {
    setCurrentTime(time);
  };

  const handleChatSubmit = () => {
    if (!chatQuery.trim()) return;

    // Mock response based on query
    let mockResponse =
      "I found relevant matches in the video at the following timestamps:";
    let mockTimestamps = [178, 234, 389];

    if (
      chatQuery.toLowerCase().includes("door") ||
      chatQuery.toLowerCase().includes("entrance")
    ) {
      mockResponse = "Door/entrance activity detected at:";
      mockTimestamps = [45, 125, 267];
    }

    setChatHistory((prev) => [
      ...prev,
      {
        query: chatQuery,
        response: mockResponse,
        timestamps: mockTimestamps,
      },
    ]);
    setChatQuery("");
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
    <div className="flex h-full bg-background">
      {/* Chat Panel */}
      <div className="w-80 border-r bg-card flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-medium flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Video Analysis
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Search for people, objects, or activities
          </p>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {chatHistory.map((chat, index) => (
              <div key={index} className="space-y-2">
                <div className="bg-primary text-primary-foreground p-3 rounded-lg text-sm">
                  {chat.query}
                </div>
                <div className="bg-muted p-3 rounded-lg text-sm space-y-2">
                  <p>{chat.response}</p>
                  <div className="flex flex-wrap gap-1">
                    {chat.timestamps.map((timestamp, idx) => (
                      <Button
                        key={idx}
                        variant="link"
                        size="sm"
                        className="p-0 h-auto text-blue-400 underline"
                        onClick={() => handleSeekToTime(timestamp)}
                      >
                        {formatTime(timestamp)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t space-y-3">
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
            <label className="text-sm font-medium mb-2 block">
              Or describe what to find:
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., person in blue shirt..."
                value={chatQuery}
                onChange={(e) => setChatQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleChatSubmit()}
                className="flex-1"
                size={undefined}
              />
              <Button size="sm" onClick={handleChatSubmit}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b p-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h1>{evidence.name}</h1>
              <p className="text-sm text-muted-foreground">
                {evidence.description} • {evidence.fileSize}
              </p>
            </div>
            <Badge variant="secondary">{evidence.type}</Badge>
          </div>
        </div>

        {/* Video Player */}
        <div className="flex-1 flex flex-col p-4 overflow-hidden">
          <div className="flex-1 bg-black rounded-lg relative overflow-hidden mb-4 min-h-0">
            {/* Mock video placeholder */}
            <div className="w-full h-full flex items-center justify-center">
              <ImageWithFallback
                src={evidence.thumbnail || ""}
                alt="Video frame"
                className="max-w-full max-h-full object-contain"
              />
              {/* Play overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  size="lg"
                  className="rounded-full w-16 h-16"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Video Controls */}
          <div className="space-y-4 flex-shrink-0 overflow-y-auto">
            {/* Timeline with flags */}
            <div className="relative ml-4 mt-2">
              <div className="w-full bg-muted rounded-full h-2 relative">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
                {/* Detection flags */}
                {detectedFlags.map((flag, index) => (
                  <button
                    key={index}
                    className={`absolute top-0 w-3 h-3 rounded-full ${flag.color} transform -translate-y-0.5 -translate-x-1.5 hover:scale-125 transition-transform`}
                    style={{ left: `${(flag.time / duration) * 100}%` }}
                    onClick={() => handleSeekToTime(flag.time)}
                    title={`${flag.label} - ${formatTime(flag.time)}`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" size="sm">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Button variant="outline" size="sm">
                <SkipForward className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Volume2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>

            {/* Detection Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Detection Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-red-100 text-red-800">
                    <Flag className="h-3 w-3 mr-1" />
                    Person in red jacket (4)
                  </Badge>
                  <Badge className="bg-orange-100 text-orange-800">
                    <User className="h-3 w-3 mr-1" />
                    Suspects (2)
                  </Badge>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Zap className="h-3 w-3 mr-1" />
                    Suspicious activity (1)
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
