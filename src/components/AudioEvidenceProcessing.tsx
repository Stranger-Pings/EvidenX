import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import {
  ArrowLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Download,
  FileText,
  AudioLines,
} from "lucide-react";
import { mockEvidence } from "../data/mockData";
import { Evidence } from "../types/case";
import { motion } from "framer-motion";

interface AudioEvidenceProcessingProps {
  evidenceId: string;
  onBack: () => void;
}

export function AudioEvidenceProcessing({
  evidenceId,
  onBack,
}: AudioEvidenceProcessingProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // Mock current time in seconds
  const [duration, setDuration] = useState(0);
  const [transcript, setTranscript] = useState(
    `speaker_0: "good evening i need to ask you about the missing person sarah green when did you last see her"
speaker_1: "i saw her yesterday i found six in the evening near the old life"
speaker_0: "interesting did she mention where she was going"
speaker_1: "yes she said she was heading to meet a friend at the cafe on main street alright"
speaker_0: "did you notice anything unusual about her behavior"
speaker_1: "she seemed nervous like she was being followed"
speaker_0: "thank you your information will help us investigating further"`
  );
  const [followUpQuestions, setFollowUpQuestions] = useState([
    "Can you describe the tools or bag you mentioned in more detail?",
    "What was your exact position when you first spotted the suspects?",
    "Have you seen these individuals before at the complex?",
    "What security protocols were you following that night?",
    "Did you check the CCTV monitors during or after the incident?",
  ]);
  const [newQuestion, setNewQuestion] = useState("");
  const [showQuestions, setShowQuestions] = useState(false);

  const evidence: Evidence | undefined = mockEvidence.find(
    (e) => e.id === evidenceId
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!evidence) {
    return <div>Evidence not found</div>;
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const addFollowUpQuestion = () => {
    if (newQuestion.trim()) {
      setFollowUpQuestions((prev) => [...prev, newQuestion.trim()]);
      setNewQuestion("");
    }
  };

  const removeFollowUpQuestion = (index: number) => {
    setFollowUpQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSeek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  // Show follow-up questions after delay
  useEffect(() => {
    const lines = transcript.split("\n");
    const totalTime = lines.length * 300 + 500; // 0.3s per line + buffer
    const timer = setTimeout(() => setShowQuestions(true), totalTime);
    return () => clearTimeout(timer);
  }, [transcript]);

  // Play/pause audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Update currentTime and duration
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoaded = () => setDuration(Math.floor(audio.duration));
    const handleTimeUpdate = () =>
      setCurrentTime(Math.floor(audio.currentTime));

    audio.addEventListener("loadedmetadata", handleLoaded);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoaded);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  const timestampMatches = transcript.match(/\[\d{2}:\d{2}\]/g) || [];

  const lines = transcript.split("\n");

  return (
    <div className="flex h-screen bg-background">
      {/* Audio Player Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b p-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            {/* <h1 className="text-3xl font-bold bg-gradient-to-r from-audio-primary to-audio-secondary bg-clip-text text-transparent">
                Audio Comparison Analysis
              </h1> */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-audio-primary to-audio-secondary bg-clip-text text-transparent">
                {evidence.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                {evidence.description} • {evidence.fileSize} •{" "}
                {evidence.duration}
              </p>
            </div>
            <Badge variant="secondary">{evidence.type}</Badge>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Audio Player */}
          <audio ref={audioRef} src={evidence.url} preload="metadata" />
          <div className="flex-1 p-4 space-y-6">
            {/* Waveform Visualization */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AudioLines className="h-4 w-4" /> Audio Waveform
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-muted rounded-lg flex items-center justify-center mb-4">
                  <div className="flex items-end space-x-1 h-20">
                    {Array.from({ length: 50 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-2 bg-primary rounded-sm ${
                          i < (currentTime / duration) * 50
                            ? "opacity-100"
                            : "opacity-30"
                        }`}
                        style={{ height: `${Math.random() * 80 + 20}%` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-2 w-full">
                  <div className="w-full bg-muted rounded-full h-2 relative">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                    {timestampMatches.slice(0, 8).map((timestamp, index) => {
                      const match = timestamp.match(/\[(\d{2}):(\d{2})\]/);
                      if (match) {
                        const minutes = parseInt(match[1]);
                        const seconds = parseInt(match[2]);
                        const totalSeconds = minutes * 60 + seconds;
                        return (
                          <button
                            key={index}
                            className="absolute top-0 w-2 h-4 bg-yellow-500 rounded-sm transform -translate-y-1 -translate-x-1 hover:bg-yellow-400 transition-colors"
                            style={{
                              left: duration
                                ? `${(totalSeconds / duration) * 100}%`
                                : "0%",
                            }}
                            onClick={() => setCurrentTime(totalSeconds)}
                            title={`Jump to ${timestamp}`}
                          />
                        );
                      }
                      return null;
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-center gap-4 mt-4">
                  <Button size="sm" onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSeek(Math.max(0, currentTime - 10))}
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleSeek(Math.min(duration, currentTime + 10))
                    }
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>

                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Follow-up Questions */}
            {!showQuestions ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Generated Follow-up Questions
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Preparing questions based on transcript...
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Generated Follow-up Questions
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      AI-generated questions based on the transcript analysis
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 h-24 overflow-y-auto">
                      {followUpQuestions.map((question, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.2, duration: 0.4 }}
                          className="flex items-start gap-2 p-3 bg-muted rounded-lg"
                        >
                          <span className="text-sm font-medium text-muted-foreground flex-shrink-0">
                            Q{index + 1}:
                          </span>
                          <span className="text-sm flex-1">{question}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFollowUpQuestion(index)}
                            className="text-muted-foreground hover:text-destructive h-6 w-6 p-0"
                          >
                            ×
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                    <Textarea
                      placeholder="Add a custom follow-up question..."
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      className="resize-none"
                      rows={1}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Transcript Panel */}
          <div className="w-96 border bg-card flex flex-col overflow-hidden rounded-lg mr-4 min-h-0">
            <div className="p-4 border-b flex-shrink-0">
              <h3 className="font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" /> Auto-Generated Transcript
              </h3>
            </div>
            <ScrollArea className="flex-1 p-4 min-h-0">
              <div className="space-y-3 text-sm">
                {transcript.split("\n").map((line, index) => {
                  const match = line.match(/^(speaker_\d+):\s*"(.*)"$/i);
                  if (!match) return null;

                  const [, speaker, text] = match;
                  const isSpeaker0 = speaker === "speaker_0";

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className={`rounded-lg p-3 max-w-[85%] break-words ${
                        isSpeaker0
                          ? "bg-blue-50 self-start border-l-4 border-blue-400"
                          : "bg-gray-100 self-end border-r-4 border-gray-400"
                      }`}
                      style={{
                        alignSelf: isSpeaker0 ? "flex-start" : "flex-end",
                      }}
                    >
                      <div className="uppercase text-xs font-semibold mb-1 text-muted-foreground">
                        {speaker.replace("_", " ")}
                      </div>
                      <div className="text-sm">{text}</div>
                    </motion.div>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="p-4 border-t flex-shrink-0">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="h-3 w-3 mr-1" /> Export
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Edit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
