import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import {
  ArrowLeft,
  Search,
  Filter,
  Upload,
  Play,
  FileText,
  Image,
  Video,
  Headphones,
  Calendar,
  MessageSquare,
  Download,
  Eye,
} from "lucide-react";
import { mockCases, mockEvidence } from "../data/mockData";
import { Case, Evidence } from "../types/case";

interface CaseDetailsPageProps {
  caseId: string;
  onBack: () => void;
  onViewTimeline: () => void;
  onViewVideo: (evidenceId: string) => void;
  onViewAudio: (evidenceId: string) => void;
  onCompareAudios: (evidenceIds: string[]) => void;
}

export function CaseDetailsPage({
  caseId,
  onBack,
  onViewTimeline,
  onViewVideo,
  onViewAudio,
  onCompareAudios,
}: CaseDetailsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvidence, setSelectedEvidence] = useState<string[]>([]);
  const [chatQuery, setChatQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      query: "What time did the suspects enter the building?",
      response:
        "Based on CCTV analysis, two suspects entered at 02:32 AM through the main entrance. Video timestamp: 02:32:15",
      videoTimestamp: 9135, // seconds
    },
    {
      query: "Are there any contradictions in witness statements?",
      response:
        "Security guard mentions 2:30 AM while store owner suggests earlier timing. Audio evidence shows discrepancy in timeline accounts.",
      audioTimestamps: [145, 670], // seconds in different audio files
    },
  ]);

  const case_: Case | undefined = mockCases.find((c) => c.id === caseId);
  const caseEvidence = mockEvidence.filter((e) => e.caseId === caseId);

  if (!case_) {
    return <div>Case not found</div>;
  }

  const filteredEvidence = caseEvidence.filter(
    (evidence) =>
      evidence.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evidence.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evidence.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const getEvidenceIcon = (type: Evidence["type"]) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "audio":
        return <Headphones className="h-4 w-4" />;
      case "image":
        return <Image className="h-4 w-4" />;
      case "document":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleEvidenceSelect = (evidenceId: string) => {
    console.log("Selecting evidence:", evidenceId);
    setSelectedEvidence((prev) => {
      const newSelection = prev.includes(evidenceId)
        ? prev.filter((id) => id !== evidenceId)
        : [...prev, evidenceId];
      console.log("New selection:", newSelection);
      return newSelection;
    });
  };

  const handleAnalyzeSelected = () => {
    const audioEvidence = selectedEvidence.filter((id) => {
      const evidence = caseEvidence.find((e) => e.id === id);
      return evidence?.type === "audio";
    });
    if (audioEvidence.length > 1) {
      onCompareAudios(audioEvidence);
    }
  };

  const handlePreviewDocument = (evidenceId: string) => {
    // Add document preview functionality here
    console.log("Previewing document:", evidenceId);
  };

  const getSelectedAudioCount = () => {
    return selectedEvidence.filter((id) => {
      const evidence = caseEvidence.find((e) => e.id === id);
      return evidence?.type === "audio";
    }).length;
  };

  const getSelectedAudioNames = () => {
    return selectedEvidence
      .filter((id) => {
        const evidence = caseEvidence.find((e) => e.id === id);
        return evidence?.type === "audio";
      })
      .map((id) => {
        const evidence = caseEvidence.find((e) => e.id === id);
        return evidence?.name || id;
      });
  };

  const handleChatSubmit = () => {
    if (!chatQuery.trim()) return;

    // Mock response
    const mockResponse =
      "I found 3 relevant pieces of evidence related to your query. Video evidence shows movement at 02:45 AM (timestamp: 02:45:30).";
    setChatHistory((prev) => [
      ...prev,
      {
        query: chatQuery,
        response: mockResponse,
        videoTimestamp: 9930,
      },
    ]);
    setChatQuery("");
  };

  return (
    <div className="flex h-full bg-background">
      {/* Chat Panel */}
      <div className="w-80 border-r bg-card flex flex-col h-full">
        <div className="p-4 border-b flex-shrink-0">
          <h3 className="font-medium flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            AI Assistant
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Query across all case evidence
          </p>
        </div>

        <ScrollArea className="flex-1 p-4 min-h-0">
          <div className="space-y-4">
            {chatHistory.map((chat, index) => (
              <div key={index} className="space-y-2">
                <div className="bg-primary text-primary-foreground p-3 rounded-lg text-sm">
                  {chat.query}
                </div>
                <div className="bg-muted p-3 rounded-lg text-sm">
                  {chat.response}
                  {chat.videoTimestamp && (
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 h-auto text-blue-400 underline mt-2"
                    >
                      Jump to video ({Math.floor(chat.videoTimestamp / 60)}:
                      {(chat.videoTimestamp % 60).toString().padStart(2, "0")})
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t flex-shrink-0">
          <div className="flex gap-2">
            <Input
              placeholder="Ask about evidence..."
              value={chatQuery}
              onChange={(e) => setChatQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleChatSubmit()}
              className="flex-1"
            />
            <Button size="sm" onClick={handleChatSubmit}>
              Send
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="border-b p-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1>{case_.title}</h1>
                <Badge
                  className={
                    case_.status === "Open"
                      ? "bg-blue-100 text-blue-800"
                      : case_.status === "In-Progress"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }
                >
                  {case_.status}
                </Badge>
                <Badge
                  variant={
                    case_.visibility === "Private" ? "destructive" : "secondary"
                  }
                >
                  {case_.visibility}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {case_.firNumber} • Registered:{" "}
                {new Date(case_.registeredDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {selectedEvidence.length > 0 && (
                <Badge variant="outline" className="mr-2">
                  {selectedEvidence.length} selected
                </Badge>
              )}
              <Button onClick={onViewTimeline} variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                View Timeline
              </Button>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="flex-1 p-4 overflow-hidden">
          <Tabs defaultValue="overview" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
              <TabsTrigger value="overview">Case Overview</TabsTrigger>
              <TabsTrigger value="evidence">Evidence Repository</TabsTrigger>
            </TabsList>

            <TabsContent
              value="overview"
              className="mt-4 flex-1 overflow-y-auto"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Case Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Case Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">FIR Number:</span>
                        <p className="text-muted-foreground">
                          {case_.firNumber}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Location:</span>
                        <p className="text-muted-foreground">
                          {case_.location}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Petitioner:</span>
                        <p className="text-muted-foreground">
                          {case_.petitioner}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Accused:</span>
                        <p className="text-muted-foreground">{case_.accused}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">
                          Investigating Officer:
                        </span>
                        <p className="text-muted-foreground">
                          {case_.investigatingOfficer}
                        </p>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Summary:</span>
                      <p className="text-muted-foreground mt-1">
                        {case_.summary}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Evidence Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <Video className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                        <div className="font-medium">
                          {
                            caseEvidence.filter((e) => e.type === "video")
                              .length
                          }
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Videos
                        </div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <Headphones className="h-6 w-6 mx-auto mb-2 text-green-600" />
                        <div className="font-medium">
                          {
                            caseEvidence.filter((e) => e.type === "audio")
                              .length
                          }
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Audio Files
                        </div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <FileText className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                        <div className="font-medium">
                          {
                            caseEvidence.filter((e) => e.type === "document")
                              .length
                          }
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Documents
                        </div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <Image className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                        <div className="font-medium">
                          {
                            caseEvidence.filter((e) => e.type === "image")
                              .length
                          }
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Images
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent
              value="evidence"
              className="mt-4 flex-1 flex flex-col overflow-hidden"
            >
              {/* Sticky Evidence Controls */}
              <div className="sticky top-0 z-10 bg-background pb-4 mb-4">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search evidence..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    {selectedEvidence.length > 0 && (
                      <div className="flex items-center gap-2">
                        {getSelectedAudioCount() > 1 && (
                          <Button
                            onClick={handleAnalyzeSelected}
                            variant="default"
                          >
                            <Headphones className="h-4 w-4 mr-2" />
                            Compare Audio ({getSelectedAudioCount()})
                          </Button>
                        )}
                        {selectedEvidence.length > 0 &&
                          getSelectedAudioCount() <= 1 && (
                            <div className="text-sm text-muted-foreground">
                              Select 2+ audio files to compare
                            </div>
                          )}
                      </div>
                    )}
                    <Button>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Evidence
                    </Button>
                  </div>
                </div>
              </div>

              {/* Sticky Selection Summary */}
              {selectedEvidence.length > 0 && (
                <div className="sticky top-[73px] z-10 bg-background pb-4 mb-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {selectedEvidence.length} item
                            {selectedEvidence.length !== 1 ? "s" : ""} selected
                          </span>
                          {getSelectedAudioCount() > 0 && (
                            <Badge variant="secondary" className="ml-2">
                              {getSelectedAudioCount()} audio file
                              {getSelectedAudioCount() !== 1 ? "s" : ""}
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {getSelectedAudioNames().map((name, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Scrollable Evidence Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="space-y-4">
                  {/* Evidence Grid */}
                  {filteredEvidence.length > 0 && (
                    <div className="py-3 my-4">
                      <p className="text-sm text-muted-foreground">
                        💡 Click on evidence cards or checkboxes to select
                        multiple items for comparison
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredEvidence.map((evidence) => (
                      <Card
                        key={evidence.id}
                        className={`cursor-pointer transition-all hover:shadow-md hover:ring-1 hover:ring-primary/20 hover:bg-accent/50 flex flex-col h-full ${
                          selectedEvidence.includes(evidence.id)
                            ? "ring-2 ring-primary bg-primary/5"
                            : ""
                        }`}
                      >
                        <CardHeader className="pb-2 flex-shrink-0">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              {getEvidenceIcon(evidence.type)}
                              <span className="font-medium text-sm">
                                {evidence.type}
                              </span>
                              {selectedEvidence.includes(evidence.id) && (
                                <Badge variant="secondary" className="text-xs">
                                  Selected
                                </Badge>
                              )}
                            </div>
                            <input
                              type="checkbox"
                              checked={selectedEvidence.includes(evidence.id)}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleEvidenceSelect(evidence.id);
                              }}
                              className="w-4 h-4 rounded border border-input bg-background text-primary hover:cursor-pointer focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                          </div>
                          <CardTitle className="text-base line-clamp-2">
                            {evidence.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 flex-1 flex flex-col">
                          <div className="flex-1 space-y-3">
                            {evidence.thumbnail && (
                              <div className="aspect-video bg-muted rounded overflow-hidden">
                                <img
                                  src={evidence.thumbnail}
                                  alt={evidence.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            {evidence.type === "audio" &&
                              !evidence.thumbnail && (
                                <div className="aspect-video bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded overflow-hidden relative">
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="flex items-end gap-1 h-16 w-full max-w-xs px-4">
                                      {Array.from({ length: 20 }, (_, i) => (
                                        <div
                                          key={i}
                                          className="bg-primary dark:bg-blue-400 rounded-sm flex-1"
                                          style={{
                                            height: `${
                                              Math.random() * 60 + 20
                                            }%`,
                                          }}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                  <div className="absolute top-2 right-2">
                                    <div className="bg-white/90 dark:bg-black/90 rounded-full p-2">
                                      <Headphones className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                  </div>
                                </div>
                              )}

                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {evidence.description}
                            </p>

                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{evidence.fileSize}</span>
                              {evidence.duration && (
                                <span>{evidence.duration}</span>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {evidence.tags.slice(0, 3).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2 mt-auto">
                            <div className="flex-1">
                              {evidence.type === "video" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full"
                                  onClick={(e: {
                                    stopPropagation: () => void;
                                  }) => {
                                    e.stopPropagation();
                                    onViewVideo(evidence.id);
                                  }}
                                >
                                  <Play className="h-3 w-3 mr-1" />
                                  Analyze
                                </Button>
                              )}
                              {evidence.type === "audio" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full"
                                  onClick={(e: {
                                    stopPropagation: () => void;
                                  }) => {
                                    e.stopPropagation();
                                    onViewAudio(evidence.id);
                                  }}
                                >
                                  <Headphones className="h-3 w-3 mr-1" />
                                  Analyze
                                </Button>
                              )}
                              {evidence.type === "document" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full"
                                  onClick={(e: {
                                    stopPropagation: () => void;
                                  }) => {
                                    e.stopPropagation();
                                    handlePreviewDocument(evidence.id);
                                  }}
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  Preview
                                </Button>
                              )}
                              {evidence.type === "image" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full"
                                  onClick={(e: {
                                    stopPropagation: () => void;
                                  }) => {
                                    e.stopPropagation();
                                    // Add image preview functionality here
                                  }}
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  Preview
                                </Button>
                              )}
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Add download functionality here
                              }}
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
