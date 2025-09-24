import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { ScrollArea } from "./ui/scroll-area";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import {
  ArrowLeft,
  Play,
  Pause,
  User,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  FileText,
  ChevronRight,
  Headphones,
  Eye,
} from "lucide-react";
import { mockEvidence, mockAudioComparisons } from "../data/mockData";
import { Evidence, type AudioComparison } from "../types/case";

interface AudioComparisonProps {
  evidenceIds: string[];
  onBack: () => void;
  onViewAudio: (evidenceId: string) => void;
}

export function AudioComparison({
  evidenceIds,
  onBack,
  onViewAudio,
}: AudioComparisonProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [selectedAudioIndex, setSelectedAudioIndex] = useState(0);

  const audioEvidence = evidenceIds
    .map((id) => mockEvidence.find((e) => e.id === id))
    .filter((e): e is Evidence => e !== undefined && e.type === "audio");

  const comparisonData = mockAudioComparisons.filter((comp) =>
    evidenceIds.includes(comp.audioId)
  );

  // Mock comparison analysis data
  const analysisData = [
    {
      topic: "Time of incident",
      witness1: "Around 2:30 AM",
      witness2: "Approximately 2:15 AM",
      status: "contradiction",
      details: "15-minute discrepancy in reported time",
    },
    {
      topic: "Number of suspects",
      witness1: "Two individuals",
      witness2: "Two people",
      status: "similarity",
      details: "Both witnesses consistently report two suspects",
    },
    {
      topic: "Suspect clothing",
      witness1: "Dark clothes and caps",
      witness2: "Dark attire, couldn't see faces clearly",
      status: "similarity",
      details: "Consistent description of dark clothing",
    },
    {
      topic: "Suspect behavior",
      witness1: "Rushing, avoiding lights",
      witness2: "Seemed in hurry, furtive movements",
      status: "similarity",
      details: "Both describe suspicious, hurried behavior",
    },
    {
      topic: "Items carried",
      witness1: "One person carrying something",
      witness2: "Noticed bag or tools",
      status: "gray_area",
      details: "Similar observation but unclear specifics",
    },
    {
      topic: "Exit observation",
      witness1: "Didn't see them leave",
      witness2: "Not mentioned",
      status: "gray_area",
      details: "Incomplete information about suspects' departure",
    },
  ];

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "contradiction":
        return "bg-red-500 text-white border-red-500";
      case "similarity":
        return "bg-green-500 text-white border-green-500";
      case "gray_area":
        return "bg-yellow-500 text-white border-yellow-500";
      default:
        return "bg-gray-500 text-white border-gray-500";
    }
  };

  const handlePlayToggle = (audioId: string) => {
    setPlayingId(playingId === audioId ? null : audioId);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center gap-4 pb-4 mb-4 border-b">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1>Audio Comparison Analysis</h1>
            <p className="text-sm text-muted-foreground">
              Comparing {audioEvidence.length} audio testimonies for
              contradictions and similarities
            </p>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={onBack} className="cursor-pointer">
                Case Details
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Audio Comparison</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Audio Files Navigation */}
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Headphones className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Selected Audio Files:</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {audioEvidence.map((audio, index) => (
              <div key={audio.id} className="flex items-center gap-2">
                <Button
                  variant={selectedAudioIndex === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedAudioIndex(index)}
                  className="flex items-center gap-2"
                >
                  <Headphones className="h-3 w-3" />
                  {audio.name}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewAudio(audio.id)}
                  className="p-1"
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

      <div className="flex-1 p-4">
        <Tabs defaultValue="overview" className="h-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analysis">Detailed Analysis</TabsTrigger>
            <TabsTrigger value="transcripts">Transcripts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-6">
            {/* Witness Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {comparisonData.map((witness) => (
                <Card key={witness.id}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={witness.witnessImage} />
                        <AvatarFallback>
                          <User className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-base">
                          {witness.witnessName}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Audio ID: {witness.audioId}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePlayToggle(witness.audioId)}
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
                        >
                          <FileText className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Summary</h4>
                      <p className="text-sm text-muted-foreground">
                        {witness.summary}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center p-2 bg-red-50 rounded">
                        <div className="font-medium text-red-700">
                          {witness.contradictions.length}
                        </div>
                        <div className="text-red-600">Contradictions</div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="font-medium text-green-700">
                          {witness.similarities.length}
                        </div>
                        <div className="text-green-600">Similarities</div>
                      </div>
                      <div className="text-center p-2 bg-yellow-50 rounded">
                        <div className="font-medium text-yellow-700">
                          {witness.grayAreas.length}
                        </div>
                        <div className="text-yellow-600">Gray Areas</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Analysis Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <div>
                      <div className="font-medium">Contradictions</div>
                      <div className="text-sm text-muted-foreground">
                        {
                          analysisData.filter(
                            (d) => d.status === "contradiction"
                          ).length
                        }{" "}
                        identified
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium">Similarities</div>
                      <div className="text-sm text-muted-foreground">
                        {
                          analysisData.filter((d) => d.status === "similarity")
                            .length
                        }{" "}
                        found
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <HelpCircle className="h-5 w-5 text-yellow-500" />
                    <div>
                      <div className="font-medium">Gray Areas</div>
                      <div className="text-sm text-muted-foreground">
                        {
                          analysisData.filter((d) => d.status === "gray_area")
                            .length
                        }{" "}
                        require clarification
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Detailed Comparison Analysis
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Point-by-point comparison of witness testimonies
                </p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Topic</TableHead>
                      <TableHead>Witness 1</TableHead>
                      <TableHead>Witness 2</TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead>Analysis</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analysisData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {row.topic}
                        </TableCell>
                        <TableCell>{row.witness1}</TableCell>
                        <TableCell>{row.witness2}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(row.status)}>
                            {getStatusIcon(row.status)}
                            <span className="ml-1 capitalize">
                              {row.status.replace("_", " ")}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {row.details}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transcripts" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {comparisonData.map((witness) => (
                <Card key={witness.id}>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={witness.witnessImage} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      {witness.witnessName}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePlayToggle(witness.audioId)}
                      >
                        {playingId === witness.audioId ? (
                          <Pause className="h-3 w-3 mr-1" />
                        ) : (
                          <Play className="h-3 w-3 mr-1" />
                        )}
                        {playingId === witness.audioId ? "Pause" : "Play"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewAudio(witness.audioId)}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Full Analysis
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64">
                      <div className="space-y-2 text-sm">
                        <p className="leading-relaxed">{witness.transcript}</p>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
