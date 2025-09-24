import { useState } from "react";
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

interface AudioEvidenceProcessingProps {
  evidenceId: string;
  onBack: () => void;
}

export function AudioEvidenceProcessing({
  evidenceId,
  onBack,
}: AudioEvidenceProcessingProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(125); // Mock current time in seconds
  const [duration] = useState(525); // Mock duration (8:45)
  const [transcript, setTranscript] =
    useState(`[00:00] Interview begins. State your name and position for the record.

[00:15] My name is Rajesh Kumar, and I work as a security guard at Metro Shopping Complex.

[00:25] Can you tell us what you witnessed on the night of January 15th?

[00:35] Yes, I was on duty that night. Around 2:30 AM, I saw two people coming through the main gate. They looked suspicious to me.

[01:15] Can you describe these individuals?

[01:22] They were both wearing dark clothes and caps. One was taller than the other. They were trying to avoid the main lights.

[02:30] What happened next?

[02:35] I tried to question them, but they rushed inside before I could stop them properly. I should have been more alert.

[03:45] Did you see them exit the building?

[03:52] No, I didn't see them leave. I was making my rounds and checking other areas.

[05:30] Is there anything else you remember about that night?

[05:38] The shorter person seemed to be carrying something, maybe a bag or tools. I regret not following them immediately.`);

  const [followUpQuestions, setFollowUpQuestions] = useState([
    "Can you describe the tools or bag you mentioned in more detail?",
    "What was your exact position when you first spotted the suspects?",
    "Have you seen these individuals before at the complex?",
    "What security protocols were you following that night?",
    "Did you check the CCTV monitors during or after the incident?",
  ]);

  const [newQuestion, setNewQuestion] = useState("");

  const evidence: Evidence | undefined = mockEvidence.find(
    (e) => e.id === evidenceId
  );

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

  const handleSeekToTime = (timeStr: string) => {
    // Parse time string like "[02:35]" to seconds
    const match = timeStr.match(/\[(\d{2}):(\d{2})\]/);
    if (match) {
      const minutes = parseInt(match[1]);
      const seconds = parseInt(match[2]);
      setCurrentTime(minutes * 60 + seconds);
    }
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

  // Parse transcript to find timestamps
  const timestampMatches = transcript.match(/\[\d{2}:\d{2}\]/g) || [];

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
            <div className="flex-1">
              <h1>{evidence.name}</h1>
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
          <div className="flex-1 p-4 space-y-6">
            {/* Waveform Visualization */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AudioLines className="h-4 w-4" />
                  Audio Waveform
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-muted rounded-lg flex items-center justify-center mb-4">
                  <div className="flex items-end space-x-1 h-20">
                    {/* Mock waveform bars */}
                    {Array.from({ length: 50 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-2 bg-primary rounded-sm ${
                          i < (currentTime / duration) * 50
                            ? "opacity-100"
                            : "opacity-30"
                        }`}
                        style={{
                          height: `${Math.random() * 80 + 20}%`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-2">
                  <div className="w-full bg-muted rounded-full h-2 relative">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                    {/* Timestamp markers */}
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
                              left: `${(totalSeconds / duration) * 100}%`,
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
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Follow-up Questions */}
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
                    <div
                      key={index}
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
                    </div>
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
          </div>

          {/* Transcript Panel */}
          <div className="w-96 border-l bg-card flex flex-col overflow-hidden">
            <div className="p-4 border-b flex-shrink-0">
              <h3 className="font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Auto-Generated Transcript
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Click on timestamps to navigate
              </p>
            </div>

            <ScrollArea className="flex-1 p-4 min-h-0 overflow-y-auto">
              <div className="space-y-2 text-sm">
                {transcript.split("\n\n").map((paragraph, index) => {
                  const hasTimestamp = paragraph.includes("[");
                  const timestampMatch = paragraph.match(/(\[\d{2}:\d{2}\])/);

                  return (
                    <div key={index} className="leading-relaxed">
                      {hasTimestamp && timestampMatch ? (
                        <div>
                          <button
                            className="text-blue-600 hover:text-blue-800 font-mono text-xs mr-2 underline"
                            onClick={() => handleSeekToTime(timestampMatch[1])}
                          >
                            {timestampMatch[1]}
                          </button>
                          <span>
                            {paragraph.replace(timestampMatch[1], "").trim()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          {paragraph}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="p-4 border-t flex-shrink-0">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="h-3 w-3 mr-1" />
                  Export
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
