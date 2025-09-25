import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Search,
  Filter,
  Upload,
  Play,
  FileText,
  Image,
  Video,
  Headphones,
  Download,
  Eye,
  TrendingUp,
  MessageCircleMore,
} from "lucide-react";
import { dataValuesCases, dataValuesEvidence } from "../data/dataValues";
import { Case, Evidence } from "../types/case";
import EvidenceSummary from "./EvidenceSummary";
import CaseProgressBadge from "./common/CaseProgressBadge";
import CaseAccessBadge from "./common/CaseAccessBadge";
import { VideoPlayerPopup } from "./VideoPlayerPopup";
import ChatPanel from "./chat/ChatPanel";
import BackButton from "./common/BackButton";
import GradientHeader from "./common/GradientHeader";

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
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);
  const [videoPlayerOpen, setVideoPlayerOpen] = useState(false);
  const [videoTimestamp, setVideoTimestamp] = useState<number | undefined>(
    undefined
  );
  const [currentVideoTitle, setCurrentVideoTitle] =
    useState<string>("Evidence Video");
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

  const case_: Case | undefined = dataValuesCases.find((c) => c.id === caseId);
  const caseEvidence = dataValuesEvidence.filter((e) => e.caseId === caseId);

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

  const InfoItem = ({
    title,
    value,
  }: {
    title: string;
    value: React.ReactNode;
  }) => (
    <div>
      <div className="text-sm text-muted-foreground mb-1">{title}</div>
      <div className="text-base text-foreground font-medium">{value}</div>
    </div>
  );

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
    <>
      <div className="relative flex h-full bg-background">
        {/* Chat Panel */}
        {isChatPanelOpen && (
          <ChatPanel
            chatHistory={chatHistory}
            chatQuery={chatQuery}
            onChatQueryChange={setChatQuery}
            onSubmit={handleChatSubmit}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex p-6 pt-8 flex-col h-full overflow-y-auto bg-background">
          {/* Header */}
          <div className="bg-background pb-4">
            <BackButton onBack={onBack} location="Cases" />
            <div className="flex gap-4 items-baseline">
              <div className="flex-1">
                <div className="flex flex-col gap-2 mb-1">
                  <GradientHeader title={case_.title} />
                  <div className="flex gap-2 mt-3">
                    <CaseProgressBadge progress={case_.status} />
                    <CaseAccessBadge visibility={case_.visibility} />
                  </div>
                </div>
                {/* <p className="text-sm text-muted-foreground">
                  {case_.firNumber} • Registered:{" "}
                  {new Date(case_.registeredDate).toLocaleDateString()}
                </p> */}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={onViewTimeline}
                  className="rounded-md bg-primary text-primary-foreground"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Timeline
                </Button>
              </div>
            </div>
          </div>
          {/* Content Tabs */}
          <div className="flex-1 py-4">
            <Tabs defaultValue="overview" className="h-full flex flex-col">
              <div className="border-b">
                <TabsList className="flex items-center gap-6 bg-transparent rounded-none p-0">
                  <TabsTrigger
                    value="overview"
                    className="relative rounded-none border-transparent bg-background py-4 px-0 text-sm font-medium text-muted-foreground data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-none data-[state=active]:text-blue-600 after:content-[''] after:absolute after:left-0 after:-bottom-[2px] after:h-[2px] after:w-full after:bg-blue-500 after:opacity-0 data-[state=active]:after:opacity-100"
                  >
                    <FileText className="h-6 w-6 mr-2" />
                    Case Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="evidence"
                    className="relative rounded-none border-transparent bg-background px-0 py-2 text-sm font-medium text-muted-foreground data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-none data-[state=active]:text-blue-600 after:content-[''] after:absolute after:left-0 after:-bottom-[2px] after:h-[2px] after:w-full after:bg-blue-500 after:opacity-0 data-[state=active]:after:opacity-100"
                  >
                    <Image className="h-6 w-6 mr-2" />
                    Evidence Repository
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="mt-4 flex-1">
                <div className="flex gap-6 w-full">
                  {/* Case Information */}
                  <Card className="rounded-2xl shadow-sm bg-card w-4/5">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold">
                        Case Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                        <InfoItem title="FIR Number:" value={case_.firNumber} />
                        <InfoItem title="Location:" value={case_.location} />
                        <InfoItem
                          title="Petitioner:"
                          value={case_.petitioner}
                        />
                        <InfoItem title="Accused:" value={case_.accused} />
                        <div className="col-span-2">
                          <InfoItem
                            title="Investigating Officer:"
                            value={case_.investigatingOfficer}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          Description:
                        </div>
                        <p className="text-base leading-7 text-foreground">
                          {case_.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Stats */}
                  <div className="w-1/5">
                    <EvidenceSummary evidence={caseEvidence} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent
                value="evidence"
                className="mt-4 flex-1 flex flex-col"
              >
                {/* Sticky Evidence Controls */}
                <div className="flex gap-3 justify-end items-center">
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search evidence..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64 h-10"
                      />
                    </div>
                    {/* <Button
                      variant="outline"
                      className="bg-card text-primary border !border-primary h-10 !hover:bg-none"
                    >
                      <Filter className="h-4 w-4 mr-2 text-primary" />
                      Filter
                    </Button> */}
                  </div>

                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Evidence
                  </Button>
                </div>

                {/* Sticky Selection Summary */}
                {selectedEvidence.length > 0 && (
                  <div className="bg-background pt-4">
                    <Card className="">
                      <CardContent className="!py-4">
                        <div className="flex justify-between items-baseline">
                          <div>
                            <div className="flex flex-col gap-2 justify-between mb-2">
                              <span className="text-md font-medium">
                                {selectedEvidence.length} item
                                {selectedEvidence.length !== 1 ? "s" : ""}{" "}
                                selected
                              </span>
                            </div>
                            <div className="flex flex-col gap-1">
                              {getSelectedAudioNames().map((name, index) => (
                                <div
                                  key={index}
                                  className="text-sm flex text-center items-center gap-2"
                                >
                                  <Headphones className="h-4 w-4" />
                                  {name}
                                </div>
                              ))}
                            </div>
                          </div>
                          {selectedEvidence.length > 0 && (
                            <div className="flex items-center gap-2">
                              {getSelectedAudioCount() > 1 && (
                                <Button
                                  onClick={handleAnalyzeSelected}
                                  variant="default"
                                >
                                  <Headphones className="h-4 w-4 mr-2" />
                                  Analyse Audio ({getSelectedAudioCount()})
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
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Scrollable Evidence Content */}
                <div className="flex-1">
                  <div className="space-y-4">
                    {/* Evidence Grid */}
                    {filteredEvidence.length > 0 && (
                      <div className="pt-4">
                        <p className="text-sm text-muted-foreground">
                          💡 Click on evidence cards or checkboxes to select
                          multiple items for comparison
                        </p>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filteredEvidence.map((evidence) => (
                        <Card
                          key={evidence.id}
                          className={`hover-lift cursor-pointer flex flex-col h-full`}
                        >
                          <CardHeader className="pb-2 flex-shrink-0">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                {getEvidenceIcon(evidence.type)}
                                <span className="font-medium text-sm">
                                  {evidence.type}
                                </span>
                              </div>
                              {evidence.type === "audio" && (
                                <input
                                  type="checkbox"
                                  checked={selectedEvidence.includes(
                                    evidence.id
                                  )}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    handleEvidenceSelect(evidence.id);
                                  }}
                                  className="w-4 h-4 focus:ring-0 rounded  hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                                />
                              )}
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
                                    className="text-xs text-primary bg-blue-50"
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
                                    variant="secondary"
                                    className="w-full bg-secondary text-card"
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
                                    variant="secondary"
                                    className="w-full bg-secondary text-card"
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
                                    variant="secondary"
                                    className="w-full bg-secondary text-card"
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

      {/* Floating Chat Button */}
      <div
        className="fixed bottom-6 right-6 z-[9999]"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 9999,
        }}
      >
        <Button
          onClick={() => setIsChatPanelOpen(!isChatPanelOpen)}
          className="h-16 w-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer !p-0"
          size="default"
        >
          <MessageCircleMore className="!h-8 !w-8" />
        </Button>
      </div>

      {/* Video Player Popup */}
      <VideoPlayerPopup
        isOpen={videoPlayerOpen}
        onClose={() => {
          setVideoPlayerOpen(false);
          setVideoTimestamp(undefined); // reset timestamp on close
        }}
        seekToTimestamp={videoTimestamp}
        title={currentVideoTitle}
        evidenceId="VID_001"
      />
    </>
  );
}
