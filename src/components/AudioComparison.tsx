import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

import {
  ArrowLeft,
  Play,
  Pause,
  User,
  TriangleAlert as AlertTriangle,
  CircleCheck as CheckCircle,
  CircleHelp as HelpCircle,
  FileText,
  ChevronRight,
  Headphones,
  Eye,
  
  Users,
  TrendingUp,
  
} from "lucide-react";
import { dataValuesEvidence, dataValuesAudioComparisons } from "../data/dataValues";
import { Evidence, type AudioComparison } from "../types/case";

interface AudioComparisonProps {
  evidenceIds: string[];
  onBack: () => void;
  onViewAudio: (evidenceId: string) => void;
  audioComparisons?: AudioComparison[];
}

export function AudioComparison({
  evidenceIds,
  onBack,
  onViewAudio,
  audioComparisons = dataValuesAudioComparisons,
}: AudioComparisonProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [selectedAnalysisType, setSelectedAnalysisType] = useState<
    "all" | "contradiction" | "similarity" | "gray_area"
  >("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const audioEvidence = evidenceIds
    .map((id) => dataValuesEvidence.find((e) => e.id === id))
    .filter((e): e is Evidence => e !== undefined && e.type === "audio");

  const comparisonData = audioComparisons.filter(
    (comp) =>
      evidenceIds.includes(comp.mediaId1) || evidenceIds.includes(comp.mediaId2)
  );

  // Get all witnesses from all comparisons
  const allWitnesses = comparisonData.flatMap((comp) => comp.witnesses);

  // Get all detailed analysis from all comparisons
  const analysisData = comparisonData.flatMap((comp) => comp.detailedAnalysis);

  const filteredAnalysis =
    selectedAnalysisType === "all"
      ? analysisData
      : analysisData.filter((item) => item.status === selectedAnalysisType);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "contradiction":
        return <AlertTriangle className="h-4 w-4" />;
      case "similarity":
        return <CheckCircle className="h-4 w-4" />;
      case "gray_area":
        return <HelpCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "contradiction":
        return "bg-contradiction text-contradiction-foreground border-contradiction-border shadow-sm";
      case "similarity":
        return "bg-similarity text-similarity-foreground border-similarity-border shadow-sm";
      case "gray_area":
        return "bg-gray-area text-gray-area-foreground border-gray-area-border shadow-sm";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getImportanceIcon = (importance: string) => {
    switch (importance) {
      case "high":
        return <TrendingUp className="h-3 w-3 text-red-500" />;
      case "medium":
        return <TrendingUp className="h-3 w-3 text-yellow-500" />;
      case "low":
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      default:
        return null;
    }
  };

  const handlePlayToggle = (audioId: string) => {
    setPlayingId(playingId === audioId ? null : audioId);
  };

  const handleCardClick = (
    analysisType: "contradiction" | "similarity" | "gray_area"
  ) => {
    setSelectedAnalysisType(analysisType);
    setIsDialogOpen(true);
  };

  const contradictionCount = analysisData.filter(
    (d) => d.status === "contradiction"
  ).length;
  const similarityCount = analysisData.filter(
    (d) => d.status === "similarity"
  ).length;
  const grayAreaCount = analysisData.filter(
    (d) => d.status === "gray_area"
  ).length;

  const summaryCards = [
    {
      id: "contradiction",
      count: contradictionCount,
      icon: <AlertTriangle className="h-6 w-6 text-contradiction" />,
      title: "Contradictions Found",
      subtitle: "Require investigation",
      classes: {
        border: "border-contradiction-border/20",
        bg: "from-contradiction-muted to-background",
        circle: "bg-contradiction/10",
        text: "text-contradiction",
      },
    },
    {
      id: "similarity",
      count: similarityCount,
      icon: <CheckCircle className="h-6 w-6 text-similarity" />,
      title: "Similarities Found",
      subtitle: "Strong corroboration",
      classes: {
        border: "border-similarity-border/20",
        bg: "from-similarity-muted to-background",
        circle: "bg-similarity/10",
        text: "text-similarity",
      },
    },
    {
      id: "gray_area",
      count: grayAreaCount,
      icon: <HelpCircle className="h-6 w-6 text-gray-area" />,
      title: "Areas Need Clarity",
      subtitle: "Require clarification",
      classes: {
        border: "border-gray-area-border/20",
        bg: "from-gray-area-muted to-background",
        circle: "bg-gray-area/10",
        text: "text-gray-area",
      },
    },
  ];

  const getDialogTitle = () => {
    switch (selectedAnalysisType) {
      case "contradiction":
        return "Contradictions Analysis";
      case "similarity":
        return "Similarities Analysis";
      case "gray_area":
        return "Gray Areas Analysis";
      default:
        return "Analysis Details";
    }
  };

  const getDialogDescription = () => {
    switch (selectedAnalysisType) {
      case "contradiction":
        return "Areas where witness testimonies conflict and require further investigation";
      case "similarity":
        return "Areas where witness testimonies align and provide strong corroboration";
      case "gray_area":
        return "Areas that require clarification or additional information";
      default:
        return "Detailed analysis of witness testimonies";
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 flex-shrink-0">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-audio-primary to-audio-secondary bg-clip-text text-transparent">
                Audio Comparison Analysis
              </h1>
              <p className="text-muted-foreground mt-1">
                Comprehensive analysis of {allWitnesses.length} witness
                testimonies
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Headphones className="h-3 w-3" />
                {audioEvidence.length} Files
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {allWitnesses.length} Witnesses
              </Badge>
            </div>
          </div>

          {/* Audio Files */}
          <div className="flex gap-2 flex-wrap">
            {audioEvidence.map((audio, index) => (
              <div key={audio.id} className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 hover:shadow-md transition-all duration-200"
                >
                  <Headphones className="h-3 w-3" />
                  <span className="max-w-[120px] truncate">{audio.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {audio.duration}
                  </Badge>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewAudio(audio.id)}
                  className="p-2 hover:bg-audio-primary/10"
                  title="View individual analysis"
                >
                  <Eye className="h-3 w-3" />
                </Button>
                {index < audioEvidence.length - 1 && (
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="container mx-auto px-6 py-8">
          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {summaryCards.map((card) => (
              <Card
                key={card.id}
                className={`${card.classes.border} bg-gradient-to-br ${card.classes.bg} cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105`}
                onClick={() =>
                  handleCardClick(
                    card.id as "contradiction" | "similarity" | "gray_area"
                  )
                }
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${card.classes.circle}`}>
                      {card.icon}
                    </div>
                    <div>
                      <div
                        className={`text-3xl font-bold ${card.classes.text}`}
                      >
                        {card.count}
                      </div>
                      <div className="text-sm font-medium text-muted-foreground">
                        {card.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {card.subtitle}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Analysis Details Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto px-6 pt-6">
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center gap-2">
                  {getStatusIcon(selectedAnalysisType)}
                  {getDialogTitle()}
                </DialogTitle>
                <DialogDescription className="text-base">
                  {getDialogDescription()}
                </DialogDescription>
              </DialogHeader>

              <div className="m-6">
                <div className="mb-4 flex items-center gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {filteredAnalysis.length} Items Found
                  </Badge>
                </div>

                <div className="space-y-4">
                  {filteredAnalysis.map((analysis, index) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg flex items-center gap-2">
                              {analysis.topic}
                              <Badge
                                className={`${getStatusBadgeClass(
                                  analysis.status
                                )} flex items-center gap-1`}
                              >
                                {getStatusIcon(analysis.status)}
                                {analysis.status.replace("_", " ")}
                              </Badge>
                            </CardTitle>
                          </div>
                          <div className="flex items-center gap-2">
                            {getImportanceIcon(analysis?.importance ?? "low")}
                            <Badge variant="outline" className="text-xs">
                              {analysis.confidence}% confidence
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {analysis.details}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-lg bg-muted/30 border">
                            <h4 className="font-medium text-sm mb-2 text-primary">
                              Witness 1
                            </h4>
                            <p className="text-sm italic">
                              "{analysis.witness1}"
                            </p>
                          </div>
                          <div className="p-4 rounded-lg bg-muted/30 border">
                            <h4 className="font-medium text-sm mb-2 text-primary">
                              Witness 2
                            </h4>
                            <p className="text-sm italic">
                              "{analysis.witness2 ?? ""}"
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              Importance:
                            </span>
                            <Badge
                              variant={
                                analysis.importance === "high"
                                  ? "destructive"
                                  : analysis.importance === "medium"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {analysis.importance}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Analysis #{index + 1}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Witness Overview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Users className="h-5 w-5 text-audio-primary" />
                Witness Testimonies Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {allWitnesses.map((witness) => (
                  <Card
                    key={witness.id}
                    className="border-l-4 border-l-audio-primary"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 ring-2 ring-audio-primary/20">
                          <AvatarImage src={witness.witnessImage} />
                          <AvatarFallback className="bg-audio-primary/10">
                            <User className="h-6 w-6 text-audio-primary" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            {witness.witnessName}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            Audio ID: {witness.audioId}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePlayToggle(witness.audioId)}
                            className="hover:bg-audio-primary/10"
                          >
                            {playingId === witness.audioId ? (
                              <Pause className="h-3 w-3" />
                            ) : (
                              <Play className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewAudio(witness.audioId)}
                            className="hover:bg-audio-secondary/10"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2 text-sm">Summary</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {witness.summary}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2 text-sm flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          Full Transcript
                        </h4>
                        <ScrollArea className="h-40 w-full rounded border bg-muted/20 p-3">
                          <div className="text-sm leading-relaxed text-muted-foreground">
                            <p className="italic mb-2">"</p>
                            <p className="indent-4">{witness.transcript}</p>
                            <p className="italic mt-2 text-right">"</p>
                          </div>
                        </ScrollArea>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div
                          className="text-center p-3 rounded-lg bg-contradiction-muted border border-contradiction-border/30 cursor-pointer hover:bg-contradiction-muted/80 transition-colors"
                          onClick={() => handleCardClick("contradiction")}
                        >
                          <div className="font-bold text-lg text-contradiction">
                            {witness.contradictions.length}
                          </div>
                          <div className="text-xs text-contradiction font-medium">
                            Contradictions
                          </div>
                        </div>
                        <div
                          className="text-center p-3 rounded-lg bg-similarity-muted border border-similarity-border/30 cursor-pointer hover:bg-similarity-muted/80 transition-colors"
                          onClick={() => handleCardClick("similarity")}
                        >
                          <div className="font-bold text-lg text-similarity">
                            {witness.similarities.length}
                          </div>
                          <div className="text-xs text-similarity font-medium">
                            Similarities
                          </div>
                        </div>
                        <div
                          className="text-center p-3 rounded-lg bg-gray-area-muted border border-gray-area-border/30 cursor-pointer hover:bg-gray-area-muted/80 transition-colors"
                          onClick={() => handleCardClick("gray_area")}
                        >
                          <div className="font-bold text-lg text-gray-area">
                            {witness.grayAreas.length}
                          </div>
                          <div className="text-xs text-gray-area font-medium">
                            Gray Areas
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
