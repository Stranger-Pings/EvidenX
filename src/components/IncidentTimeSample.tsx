import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  Video,
  Headphones,
  Search,
  AlertCircle,
} from "lucide-react";
import { dataValuesTimelineEvents, dataValuesCases } from "../data/dataValues";
import { TimelineEvent, Case } from "../types/case";

interface IncidentTimelineProps {
  caseId: string;
  onBack: () => void;
  onViewEvidence: (evidenceId: string, evidenceType: string) => void;
}

export function IncidentTimeline({
  caseId,
  onBack,
  onViewEvidence,
}: IncidentTimelineProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSource, setSelectedSource] = useState<string>("all");

  const case_: Case | undefined = dataValuesCases.find((c) => c.id === caseId);
  const timelineEvents = dataValuesTimelineEvents.filter((e) => e.caseId === caseId);
  // Extended mock timeline data
  const extendedEvents = [
    ...timelineEvents,
    {
      id: "te5",
      caseId: "1",
      timestamp: "2024-01-18T15:30:00Z",
      title: "Store Owner Interview",
      description:
        "Detailed interview with store owner about missing inventory and damage assessment",
      evidenceId: "ev4",
      evidenceType: "audio",
      source: "audio",
    },
    {
      id: "te6",
      caseId: "1",
      timestamp: "2024-01-19T09:00:00Z",
      title: "Forensic Analysis Initiated",
      description: "Fingerprint analysis of damaged property and door handles",
      source: "case_diary",
    },
    {
      id: "te7",
      caseId: "1",
      timestamp: "2024-01-20T11:15:00Z",
      title: "CCTV Analysis Complete",
      description:
        "Video analysis reveals two suspects with distinctive clothing and behavioral patterns",
      evidenceId: "ev1",
      evidenceType: "video",
      source: "video",
    },
    {
      id: "te8",
      caseId: "1",
      timestamp: "2024-01-22T14:00:00Z",
      title: "Witness Statement Analysis",
      description:
        "Cross-verification of witness testimonies reveals timing discrepancies",
      source: "case_diary",
    },
  ].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  if (!case_) {
    return <div>Case not found</div>;
  }

  const filteredEvents = extendedEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource =
      selectedSource === "all" || event.source === selectedSource;
    return matchesSearch && matchesSource;
  });

  const getSourceIcon = (source: TimelineEvent["source"]) => {
    switch (source) {
      case "video":
        return <Video className="h-4 w-4 text-blue-600" />;
      case "audio":
        return <Headphones className="h-4 w-4 text-green-600" />;
      case "document":
        return <FileText className="h-4 w-4 text-orange-600" />;
      case "case_diary":
        return <FileText className="h-4 w-4 text-purple-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSourceColor = (source: TimelineEvent["source"]) => {
    switch (source) {
      case "video":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "audio":
        return "bg-green-100 text-green-800 border-green-200";
      case "document":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "case_diary":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };
  };

  const handleEventClick = (event: TimelineEvent) => {
    if (event.evidenceId && event.evidenceType) {
      onViewEvidence(event.evidenceId, event.evidenceType);
    }
  };

  const sourceOptions = [
    { value: "all", label: "All Sources" },
    { value: "case_diary", label: "Case Diary" },
    { value: "video", label: "Video Evidence" },
    { value: "audio", label: "Audio Evidence" },
    { value: "document", label: "Documents" },
  ];

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center gap-4 pb-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1>Incident Timeline</h1>
            <p className="text-sm text-muted-foreground">
              {case_.firNumber} • {case_.title}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search timeline events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {sourceOptions.map((option) => (
              <Button
                key={option.value}
                variant={
                  selectedSource === option.value ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedSource(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Results Summary */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {filteredEvents.length} of {extendedEvents.length} events
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>

            <div className="space-y-6">
              {filteredEvents.map((event) => {
                const { date, time } = formatDateTime(event.timestamp);
                const isClickable = event.evidenceId && event.evidenceType;

                return (
                  <div key={event.id} className="relative flex gap-6">
                    {/* Timeline dot */}
                    <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-background border-2 border-border rounded-full shrink-0">
                      {getSourceIcon(
                        event.source as
                          | "case_diary"
                          | "video"
                          | "audio"
                          | "document"
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-6">
                      <Card
                        className={`${
                          isClickable ? "cursor-pointer hover:shadow-md" : ""
                        } transition-shadow`}
                        onClick={() =>
                          isClickable &&
                          handleEventClick(event as TimelineEvent)
                        }
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge
                                  className={getSourceColor(
                                    event.source as
                                      | "case_diary"
                                      | "video"
                                      | "audio"
                                      | "document"
                                  )}
                                >
                                  {event.source.replace("_", " ")}
                                </Badge>
                                {isClickable && (
                                  <Badge variant="outline" className="text-xs">
                                    Click to view
                                  </Badge>
                                )}
                              </div>
                              <CardTitle className="text-base">
                                {event.title}
                              </CardTitle>
                            </div>
                            <div className="text-right text-sm text-muted-foreground shrink-0 ml-4">
                              <div className="font-medium">{date}</div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {time}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">
                            {event.description}
                          </p>

                          {event.evidenceId && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>Evidence ID: {event.evidenceId}</span>
                              <span>•</span>
                              <span className="capitalize">
                                {event.evidenceType} Evidence
                              </span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Empty State */}
          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <div className="text-muted-foreground mb-2">
                No timeline events found
              </div>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
