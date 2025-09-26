import React, { useState, useMemo, useEffect } from "react";
import {
  Camera,
  Mic,
  MapPin,
  Users,
  Clock,
  Eye,
  BarChart3,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import { Button } from "./ui/button";
import BackButton from "./common/BackButton";

// Type definitions
interface DateInfo {
  day: number;
  month: number;
}

interface Actor {
  id: string;
  name: string;
  color: string;
  type: "suspect" | "victim" | "witness" | "location";
}

interface Event {
  id: number;
  time: number;
  duration: number;
  actor: string;
  date: DateInfo;
  title: string;
  type: "video" | "audio" | "witness" | "location";
  confidence: number;
  evidence: string;
  description: string;
}

interface CaseData {
  title: string;
  timeframe: string;
  actors: Actor[];
  incidentDates: DateInfo[];
  events: Event[];
}

interface TimeRange {
  start: number;
  end: number;
}

interface IncidentTimelineProps {
  caseId: string;
  onBack: () => void;
  onViewEvidence: (evidenceId: string, evidenceType: string) => void;
}

const IncidentTimeline: React.FC<IncidentTimelineProps> = ({
  onBack,
  onViewEvidence,
}) => {
  const [selectedView, setSelectedView] = useState<"timeline" | "month">(
    "timeline"
  );
  const [selectedDate, setSelectedDate] = useState<DateInfo | null>(null); // null means show all incidents
  const [currentMonth, setCurrentMonth] = useState<number>(10); // October
  const [currentYear, setCurrentYear] = useState<number>(2025);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [timeRange] = useState<TimeRange>({ start: 0, end: 24 });

  // Mock investigation data based on StoryLine.txt
  const caseData: CaseData = {
    title: "Case #2025-1009: Missing Person - Ananya Sharma Investigation",
    timeframe: "October 9, 2025 - 11:30 to 12:00",
    actors: [
      {
        id: "suspect1",
        name: "Unidentified Person (Black Hoodie)",
        color: "#ef4444",
        type: "suspect",
      },
      {
        id: "victim1",
        name: "Ananya Sharma",
        color: "#3b82f6",
        type: "victim",
      },
      {
        id: "witness1",
        name: "Guard Manoj",
        color: "#10b981",
        type: "witness",
      },
      {
        id: "witness2",
        name: "Rohan Mehra",
        color: "#059669",
        type: "witness",
      },
      { id: "witness3", name: "Sameer", color: "#16a34a", type: "witness" },
      { id: "witness4", name: "Anuj", color: "#15803d", type: "witness" },
      { id: "witness5", name: "Lena Roy", color: "#0d9488", type: "witness" },
      {
        id: "witness6",
        name: "Mrs. Devi (Cleaner)",
        color: "#0891b2",
        type: "witness",
      },
    ],
    incidentDates: [
      { day: 9, month: 10 }, // October 9
    ],
    events: [
      // Guard Manoj on duty
      {
        id: 1,
        time: 11.5, // 11:30
        duration: 0.2,
        actor: "witness1",
        date: { day: 9, month: 10 },
        title: "Guard begins duty at main entrance",
        type: "video",
        confidence: 95,
        evidence: "CCTV Camera #1 - Main Entrance",
        description: "Guard Manoj starts duty near the main entrance area",
      },
      // Colleagues enter recreational room
      {
        id: 2,
        time: 11.62, // 11:37
        duration: 0.08,
        actor: "victim1",
        date: { day: 9, month: 10 },
        title: "Ananya enters Recreational Room",
        type: "video",
        confidence: 98,
        evidence: "CCTV Camera #3 - Recreational Area",
        description:
          "Ananya Sharma enters recreational room with Rohan and Sameer",
      },
      {
        id: 3,
        time: 11.62, // 11:37
        duration: 0.08,
        actor: "witness2",
        date: { day: 9, month: 10 },
        title: "Rohan enters Recreational Room",
        type: "video",
        confidence: 95,
        evidence: "CCTV Camera #3 - Recreational Area",
        description: "Rohan Mehra (Grey T-shirt) enters with Ananya and Sameer",
      },
      {
        id: 4,
        time: 11.62, // 11:37
        duration: 0.08,
        actor: "witness3",
        date: { day: 9, month: 10 },
        title: "Sameer enters Recreational Room",
        type: "video",
        confidence: 95,
        evidence: "CCTV Camera #3 - Recreational Area",
        description: "Sameer enters recreational room with colleagues",
      },
      {
        id: 5,
        time: 11.65, // 11:39
        duration: 0.05,
        actor: "witness4",
        date: { day: 9, month: 10 },
        title: "Anuj joins in Recreational Room",
        type: "video",
        confidence: 92,
        evidence: "CCTV Camera #3 - Recreational Area",
        description: "Anuj enters the recreational room",
      },
      // Rohan leaves early
      {
        id: 6,
        time: 11.68, // 11:41
        duration: 0.05,
        actor: "witness2",
        date: { day: 9, month: 10 },
        title: "Rohan leaves towards elevators",
        type: "video",
        confidence: 90,
        evidence: "CCTV Camera #4 - Elevator Area",
        description:
          "Rohan Mehra leaves recreational room and heads to elevators",
      },
      // Suspect interaction with guard
      {
        id: 7,
        time: 11.7, // 11:42
        duration: 0.1,
        actor: "suspect1",
        date: { day: 9, month: 10 },
        title: "Unidentified person interacts with guard",
        type: "video",
        confidence: 85,
        evidence: "CCTV Camera #1 - Main Entrance",
        description:
          "Person in black hoodie approaches Guard Manoj for ID inquiry - no ID found",
      },
      {
        id: 8,
        time: 11.7, // 11:42
        duration: 0.1,
        actor: "witness1",
        date: { day: 9, month: 10 },
        title: "Guard conducts ID check",
        type: "witness",
        confidence: 100,
        evidence: "Guard Statement #1",
        description:
          "Guard Manoj questions unidentified person about ID - person has no identification",
      },
      // Ananya and colleagues leave recreational room
      {
        id: 9,
        time: 11.73, // 11:44
        duration: 0.05,
        actor: "victim1",
        date: { day: 9, month: 10 },
        title: "Ananya leaves Recreational Room",
        type: "video",
        confidence: 95,
        evidence: "CCTV Camera #3 - Recreational Area",
        description:
          "Ananya Sharma exits recreational room separately from colleagues",
      },
      {
        id: 10,
        time: 11.73, // 11:44
        duration: 0.05,
        actor: "witness3",
        date: { day: 9, month: 10 },
        title: "Colleagues leave towards desks",
        type: "video",
        confidence: 88,
        evidence: "CCTV Camera #5 - Office Area",
        description:
          "Sameer, Anuj and others leave recreational room towards their desks",
      },
      // Washroom area checks
      {
        id: 11,
        time: 11.77, // 11:46
        duration: 0.08,
        actor: "witness5",
        date: { day: 9, month: 10 },
        title: "Lena checks washroom corridor",
        type: "video",
        confidence: 82,
        evidence: "CCTV Camera #6 - Washroom Corridor",
        description: "Lena Roy enters washroom corridor, finds it empty",
      },
      {
        id: 12,
        time: 11.83, // 11:50
        duration: 0.08,
        actor: "witness6",
        date: { day: 9, month: 10 },
        title: "Cleaner checks washroom area",
        type: "video",
        confidence: 85,
        evidence: "CCTV Camera #6 - Washroom Corridor",
        description:
          "Mrs. Devi (cleaner) enters washroom corridor, finds it empty",
      },
      // Critical interaction between suspect and victim
      {
        id: 13,
        time: 11.87, // 11:52
        duration: 0.07,
        actor: "suspect1",
        date: { day: 9, month: 10 },
        title: "Suspect approaches Ananya",
        type: "video",
        confidence: 90,
        evidence: "CCTV Camera #1 - Main Entrance",
        description:
          "Unidentified person in black hoodie interacts with Ananya near main entrance",
      },
      {
        id: 14,
        time: 11.87, // 11:52
        duration: 0.07,
        actor: "victim1",
        date: { day: 9, month: 10 },
        title: "Ananya interacts with suspect",
        type: "video",
        confidence: 92,
        evidence: "CCTV Camera #1 - Main Entrance",
        description:
          "Ananya Sharma engages in conversation with unidentified person",
      },
      // Final exit - critical moment
      {
        id: 15,
        time: 11.93, // 11:56
        duration: 0.12,
        actor: "victim1",
        date: { day: 9, month: 10 },
        title: "Ananya shows anxious behavior and exits",
        type: "video",
        confidence: 95,
        evidence: "CCTV Camera #1 - Main Entrance",
        description:
          "Ananya displays anxious traits and exits main entrance with unidentified person - LAST SEEN",
      },
      {
        id: 16,
        time: 11.93, // 11:56
        duration: 0.12,
        actor: "suspect1",
        date: { day: 9, month: 10 },
        title: "Suspect exits with victim",
        type: "video",
        confidence: 88,
        evidence: "CCTV Camera #1 - Main Entrance",
        description:
          "Unidentified person in black hoodie leaves premises with Ananya Sharma",
      },
    ],
  };
  /* const caseData: CaseData = {
        title: "Case #2025-0324: Downtown Bank Robbery Investigation",
        timeframe: "March 28 - April 2, 2025",
        actors: [
            { id: "suspect1", name: "Suspect A", color: "#ef4444", type: "suspect" },
            { id: "suspect2", name: "Suspect B", color: "#dc2626", type: "suspect" },
            { id: "victim1", name: "Bank Teller", color: "#3b82f6", type: "victim" },
            {
                id: "witness1",
                name: "Customer #1",
                color: "#10b981",
                type: "witness",
            },
            {
                id: "witness2",
                name: "Security Guard",
                color: "#059669",
                type: "witness",
            },
            {
                id: "location1",
                name: "Bank Interior",
                color: "#8b5cf6",
                type: "location",
            },
        ],
        incidentDates: [
            { day: 28, month: 3 }, // March 28
            { day: 31, month: 3 }, // March 31
            { day: 1, month: 4 }, // April 1
            { day: 2, month: 4 }, // April 2
        ],
        events: [
            // Day 1 (March 28) - Initial Planning & Surveillance
            {
                id: 1,
                time: 14.0,
                duration: 2.0,
                actor: "suspect1",
                date: { day: 28, month: 3 },
                title: "Bank surveillance begins",
                type: "video",
                confidence: 85,
                evidence: "CCTV Camera #3 - Exterior",
                description:
                    "Suspect A observed studying bank layout and security patterns",
            },
            {
                id: 2,
                time: 16.5,
                duration: 0.5,
                actor: "suspect2",
                date: { day: 28, month: 3 },
                title: "Vehicle reconnaissance",
                type: "video",
                confidence: 78,
                evidence: "Traffic Camera #12",
                description:
                    "Red sedan circles block multiple times, license partially obscured",
            },

            // Day 2 (March 31) - Team Meeting & Preparation
            {
                id: 3,
                time: 11.0,
                duration: 1.0,
                actor: "suspect1",
                date: { day: 31, month: 3 },
                title: "Suspects meet at location",
                type: "witness",
                confidence: 82,
                evidence: "Witness Statement #1",
                description:
                    "Two individuals seen meeting at nearby café, appeared to be planning",
            },
            {
                id: 4,
                time: 15.0,
                duration: 0.3,
                actor: "suspect2",
                date: { day: 31, month: 3 },
                title: "Equipment acquisition",
                type: "video",
                confidence: 90,
                evidence: "Store CCTV #5",
                description: "Purchase of masks and tools from hardware store",
            },

            // Day 3 (April 1) - The Bank Robbery
            {
                id: 5,
                time: 8.5,
                duration: 0.5,
                actor: "suspect1",
                date: { day: 1, month: 4 },
                title: "Suspect A arrives at bank area",
                type: "video",
                confidence: 95,
                evidence: "CCTV Camera #3 - Exterior",
                description:
                    "Individual in blue jacket observed loitering near bank entrance",
            },
            {
                id: 6,
                time: 8.7,
                duration: 0.3,
                actor: "suspect2",
                date: { day: 1, month: 4 },
                title: "Getaway vehicle positioned",
                type: "video",
                confidence: 87,
                evidence: "CCTV Camera #1 - Parking",
                description: "Red sedan parks in optimal escape position",
            },
            {
                id: 7,
                time: 9.2,
                duration: 0.8,
                actor: "suspect1",
                date: { day: 1, month: 4 },
                title: "Bank entry - robbery begins",
                type: "video",
                confidence: 98,
                evidence: "CCTV Camera #5 - Entrance",
                description: "Suspect enters bank, face covered, weapon visible",
            },
            {
                id: 8,
                time: 9.3,
                duration: 0.3,
                actor: "victim1",
                date: { day: 1, month: 4 },
                title: "Silent alarm activated",
                type: "location",
                confidence: 100,
                evidence: "Security System Log",
                description: "Bank teller triggers panic button under duress",
            },
            {
                id: 9,
                time: 9.5,
                duration: 2.0,
                actor: "witness2",
                date: { day: 1, month: 4 },
                title: "Emergency response call",
                type: "audio",
                confidence: 92,
                evidence: "911 Call Recording #447",
                description: "Security guard reports robbery in progress",
            },
            {
                id: 10,
                time: 10.0,
                duration: 0.5,
                actor: "suspect1",
                date: { day: 1, month: 4 },
                title: "Cash obtained and exit",
                type: "video",
                confidence: 95,
                evidence: "CCTV Camera #6 - Counter",
                description: "Suspect receives money bag, exits through main entrance",
            },
            {
                id: 11,
                time: 10.2,
                duration: 0.2,
                actor: "suspect2",
                date: { day: 1, month: 4 },
                title: "Escape vehicle departure",
                type: "video",
                confidence: 90,
                evidence: "CCTV Camera #1 - Parking",
                description: "Red sedan speeds away from scene",
            },

            // Day 4 (April 2) - Investigation & Evidence Discovery
            {
                id: 12,
                time: 9.0,
                duration: 1.0,
                actor: "witness1",
                date: { day: 2, month: 4 },
                title: "Witness comes forward",
                type: "witness",
                confidence: 88,
                evidence: "Witness Statement #2",
                description:
                    "Customer provides detailed description of suspects and vehicle",
            },
            {
                id: 13,
                time: 14.0,
                duration: 0.5,
                actor: "location1",
                date: { day: 2, month: 4 },
                title: "Evidence collection",
                type: "location",
                confidence: 95,
                evidence: "Forensic Report #1",
                description:
                    "Fingerprints and DNA evidence recovered from bank counter",
            },
            {
                id: 14,
                time: 16.0,
                duration: 1.5,
                actor: "suspect2",
                date: { day: 2, month: 4 },
                title: "Vehicle abandonment",
                type: "video",
                confidence: 92,
                evidence: "CCTV Camera #8 - Industrial Area",
                description: "Red sedan found abandoned, forensic team deployed",
            },
        ],
    };*/
  /* ,
      connections: [
        { from: 1, to: 3, type: 'sequence', strength: 'strong' },
        { from: 2, to: 10, type: 'sequence', strength: 'strong' },
        { from: 5, to: 6, type: 'triggered', strength: 'strong' },
        { from: 6, to: 7, type: 'response', strength: 'medium' },
        { from: 5, to: 8, type: 'sequence', strength: 'strong' },
        { from: 8, to: 9, type: 'sequence', strength: 'strong' },
        { from: 9, to: 10, type: 'sequence', strength: 'strong' },
        { from: 3, to: 4, type: 'observation', strength: 'weak' }
      ]
    };*/

  const getEvidenceIcon = (type: Event["type"]): React.ReactNode => {
    switch (type) {
      case "video":
        return <Camera className="w-3 h-3" />;
      case "audio":
        return <Mic className="w-3 h-3" />;
      case "witness":
        return <Users className="w-3 h-3" />;
      case "location":
        return <MapPin className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 90) return "bg-green-100 text-green-800 border-green-200";
    if (confidence >= 70)
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const formatTime = (time: number): string => {
    const hours = Math.floor(time);
    const minutes = Math.floor((time - hours) * 60);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const filteredEvents = useMemo(() => {
    return caseData.events.filter((event) => {
      // Show all event types and actors since filters are removed
      if (event.time < timeRange.start || event.time > timeRange.end)
        return false;
      // Filter by selected date if in timeline view
      if (selectedView === "timeline") {
        if (selectedDate) {
          // Show specific day
          if (
            event.date.day !== selectedDate.day ||
            event.date.month !== selectedDate.month
          )
            return false;
        } else {
          // Show all incidents for current month
          if (event.date.month !== currentMonth) return false;
        }
      }
      return true;
    });
  }, [
    caseData.events,
    timeRange.end,
    timeRange.start,
    selectedView,
    selectedDate,
    currentMonth,
  ]);

  const dataTimeRange = useMemo((): TimeRange => {
    if (filteredEvents.length === 0) return { start: 8, end: 12 };
    const times = filteredEvents.map((event) => event.time);
    const minTime = Math.min(...times);
    const maxTime = Math.max(
      ...times.map((time) => {
        const event = filteredEvents.find((e) => e.time === time);
        return time + (event?.duration || 0);
      })
    );
    return {
      start: Math.floor(minTime - 0.5),
      end: Math.ceil(maxTime + 0.5),
    };
  }, [filteredEvents]);

  const SwimLaneView: React.FC = () => (
    <div className="bg-card rounded-lg p-6 h-full flex flex-col shadow-sm border border-slate-200">
      {/* Timeline Controls */}
      <div className="bg-slate-50 rounded-lg p-4 mb-4 border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            {selectedDate ? (
              <p className="text-sm text-slate-600">
                {selectedDate.month === 10 ? "October" : "Month"}{" "}
                {selectedDate.day}, 2025 - Events for this day
              </p>
            ) : (
              <p className="text-sm text-slate-600">
                {currentMonth === 10 ? "October" : "Month"} {currentYear} - All
                incidents for this month
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {selectedDate ? (
                <>
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-200 text-slate-700 hover:bg-slate-300"
                  >
                    Show All
                  </button>
                  {(() => {
                    const currentIndex = caseData.incidentDates.findIndex(
                      (date) =>
                        date.day === selectedDate.day &&
                        date.month === selectedDate.month
                    );
                    const isFirst = currentIndex === 0;
                    const isLast =
                      currentIndex === caseData.incidentDates.length - 1;

                    return (
                      <>
                        <button
                          onClick={() => {
                            if (!isFirst) {
                              setSelectedDate(
                                caseData.incidentDates[currentIndex - 1]
                              );
                            }
                          }}
                          disabled={isFirst}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                            isFirst
                              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                              : "bg-blue-700 text-white hover:bg-blue-800"
                          }`}
                        >
                          ← Prev Day
                        </button>
                        <button
                          onClick={() => {
                            if (!isLast) {
                              setSelectedDate(
                                caseData.incidentDates[currentIndex + 1]
                              );
                            }
                          }}
                          disabled={isLast}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                            isLast
                              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                              : "bg-blue-700 text-white hover:bg-blue-800"
                          }`}
                        >
                          Next Day →
                        </button>
                      </>
                    );
                  })()}
                </>
              ) : (
                <>
                  <button
                    onClick={() => setSelectedDate(caseData.incidentDates[0])}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-200 text-slate-700 hover:bg-slate-300"
                  >
                    Day View
                  </button>
                  <button
                    onClick={() => {
                      if (currentMonth === 10) {
                        setCurrentMonth(9);
                      } else {
                        setCurrentMonth(currentMonth - 1);
                      }
                    }}
                    disabled={currentMonth === 10}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      currentMonth === 10
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-blue-700 text-white hover:bg-blue-800"
                    }`}
                  >
                    ← Prev Month
                  </button>
                  <button
                    onClick={() => {
                      if (currentMonth === 10) {
                        setCurrentMonth(11);
                      } else {
                        setCurrentMonth(currentMonth + 1);
                      }
                    }}
                    disabled={currentMonth === 10}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      currentMonth === 10
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-blue-700 text-white hover:bg-blue-800"
                    }`}
                  >
                    Next Month →
                  </button>
                </>
              )}
            </div>
            {selectedDate && (
              <span className="text-sm text-slate-600">
                {formatTime(dataTimeRange.start)} -{" "}
                {formatTime(dataTimeRange.end)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable timeline container */}
      <div className="overflow-auto flex-1 max-h-[calc(100vh-16rem)]">
        {/* Time axis - only show when viewing specific date */}
        {selectedDate && (
          <div className="sticky top-0 bg-white pb-4 mb-4 flex">
            <div className="w-40 flex-shrink-0 p-3 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-300 rounded-l-lg sticky left-0 z-10">
              Time (Hours)
            </div>
            <div className="relative h-12 bg-slate-50 border-t border-r border-b border-slate-300 rounded-r-lg flex-1">
              {Array.from(
                {
                  length:
                    Math.ceil(dataTimeRange.end - dataTimeRange.start) + 1,
                },
                (_, i) => dataTimeRange.start + i
              ).map((hour) => (
                <div
                  key={hour}
                  className="absolute flex flex-col items-center"
                  style={{
                    left: `${
                      ((hour - dataTimeRange.start) /
                        (dataTimeRange.end - dataTimeRange.start)) *
                      100
                    }%`,
                  }}
                >
                  <div className="w-px h-2 bg-slate-400"></div>
                  <span className="text-xs text-slate-500 mt-1">
                    {formatTime(hour)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Swim lanes */}
        <div className="space-y-1">
          {caseData.actors.map((actor) => (
            <div
              key={actor.id}
              className={`relative flex ${
                actor.type === "victim" ? "bg-amber-50 border-amber-200" : ""
              }`}
            >
              <div
                className={`w-40 flex-shrink-0 p-3 text-sm font-medium sticky left-0 bg-white z-10 border-r border-slate-200 ${
                  actor.type === "victim" ? "bg-amber-50 border-amber-200" : ""
                }`}
                style={{ color: actor.color }}
              >
                <div className="flex flex-col h-full justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full flex-shrink-0 ${
                        actor.type === "victim"
                          ? "ring-2 ring-amber-400 ring-offset-1"
                          : ""
                      }`}
                      style={{ backgroundColor: actor.color }}
                    ></div>
                    <span>{actor.name}</span>
                  </div>
                  {actor.type === "victim" && (
                    <span className="text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded-full font-medium self-start">
                      VICTIM
                    </span>
                  )}
                </div>
              </div>
              <div
                className={`flex-1 relative h-24 rounded-lg border ${
                  actor.type === "victim"
                    ? "bg-amber-50 border-amber-200"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                {filteredEvents
                  .filter((event) => event.actor === actor.id)
                  .map((event) => (
                    <div
                      key={event.id} //hover:scale-105
                      className={`absolute rounded px-2 py-1 cursor-pointer hover:scale-105 transition-all  border-2 ${
                        selectedEvent?.id === event.id
                          ? "ring-2 ring-blue-400"
                          : ""
                      } ${
                        actor.type === "victim"
                          ? "ring-2 ring-amber-400 ring-offset-1 shadow-lg"
                          : ""
                      } ${getConfidenceColor(event.confidence)}`}
                      style={{
                        left: `${
                          ((event.time - dataTimeRange.start) /
                            (dataTimeRange.end - dataTimeRange.start)) *
                            100 +
                          1
                        }%`,
                        width: `${Math.max(
                          (event.duration /
                            (dataTimeRange.end - dataTimeRange.start)) *
                            100,
                          8
                        )}%`,
                        top: "4px",
                        height: "85px",
                      }}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        {getEvidenceIcon(event.type)}
                        <span className="text-xs font-medium">
                          {formatTime(event.time)}
                        </span>
                        <span className="text-xs opacity-75">
                          {event.confidence}%
                        </span>
                        {actor.type === "victim" && (
                          <span className="text-xs bg-amber-600 text-white px-1 rounded">
                            V
                          </span>
                        )}
                      </div>
                      {!selectedDate && (
                        <div className="text-xs text-blue-700 font-medium mb-1">
                          {event.date.month === 10 ? "Oct" : "Month"}{" "}
                          {event.date.day}
                        </div>
                      )}
                      <div className="text-xs leading-tight truncate mb-1">
                        {event.title}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        📍 {event.evidence}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Connection lines */}
        {/* <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {caseData.connections.map((conn, idx) => {
          const fromEvent = filteredEvents.find(e => e.id === conn.from);
          const toEvent = filteredEvents.find(e => e.id === conn.to);
          if (!fromEvent || !toEvent) return null;

          const fromActor = caseData.actors.findIndex(a => a.id === fromEvent.actor);
          const toActor = caseData.actors.findIndex(a => a.id === toEvent.actor);
          
          const timelineWidth = 800; // matches min-w-[800px]
          const x1 = 270 + ((fromEvent.time - dataTimeRange.start) / (dataTimeRange.end - dataTimeRange.start)) * timelineWidth;
          const y1 = 40 + fromActor * 76;
          const x2 = 270 + ((toEvent.time - dataTimeRange.start) / (dataTimeRange.end - dataTimeRange.start)) * timelineWidth;
          const y2 = 40 + toActor * 76;

          return (
            <line
              key={idx}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={conn.strength === 'strong' ? '#3b82f6' : conn.strength === 'medium' ? '#10b981' : '#6b7280'}
              strokeWidth={conn.strength === 'strong' ? 2 : 1}
              strokeDasharray={conn.strength === 'weak' ? '5,5' : 'none'}
              opacity={0.6}
            />
          );
        })}
      </svg> */}
      </div>
    </div>
  );

  // NetworkView component - currently unused but kept for future implementation
  // const NetworkView: React.FC = () => (
  //   <div className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-lg">
  //     <Network className="w-16 h-16 text-gray-400 mb-4" />
  //     <h3 className="text-lg font-semibold text-gray-600 mb-2">
  //       Network Analysis View
  //     </h3>
  //     <p className="text-gray-500 text-center max-w-md">
  //       Interactive network graph showing relationships between evidence,
  //       actors, and events.
  //       <br />
  //       <span className="text-sm italic mt-2 block">
  //         (This view would show nodes connected by relationship strength)
  //       </span>
  //     </p>
  //   </div>
  // );

  const MonthView: React.FC = () => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay();

    const days: (number | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return (
      <div className="bg-card rounded-lg shadow-sm border border-slate-200">
        {/* Month Header */}
        <div className="text-white p-4 rounded-t-lg bg-blue-700">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                if (currentMonth === 1) {
                  setCurrentMonth(12);
                  setCurrentYear(currentYear - 1);
                } else {
                  setCurrentMonth(currentMonth - 1);
                }
              }}
              className="text-white hover:text-blue-200 px-4 py-2 rounded text-2xl font-bold"
            >
              ←
            </button>
            <h2 className="text-xl font-semibold">
              {monthNames[currentMonth - 1]} {currentYear}
            </h2>
            <button
              onClick={() => {
                if (currentMonth === 12) {
                  setCurrentMonth(1);
                  setCurrentYear(currentYear + 1);
                } else {
                  setCurrentMonth(currentMonth + 1);
                }
              }}
              className="text-white hover:text-blue-200 px-4 py-2 rounded text-2xl font-bold"
            >
              →
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-4">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {[
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ].map((day) => (
              <div
                key={day}
                className="p-2 text-center text-sm font-medium text-slate-600 bg-slate-50"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <div
                key={index}
                className="h-20 border border-slate-200 p-1 hover:bg-slate-50"
              >
                {day && (
                  <div className="h-full">
                    <div className="text-sm font-medium text-slate-900 mb-1">
                      {day}
                    </div>
                    {caseData.incidentDates.some(
                      (date) => date.day === day && date.month === currentMonth
                    ) && (
                      <button
                        onClick={() => {
                          setSelectedDate({ day, month: currentMonth });
                          setSelectedView("timeline");
                        }}
                        className="w-full text-xs bg-blue-700 text-white px-2 py-1 rounded-lg hover:bg-blue-800 transition-colors font-medium"
                      >
                        Incident Occurred
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full p-4 lg:p-6 bg-background">
      {/* Main content */}
      {selectedView === "month" ? (
        <MonthView />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
          {/* Case info and controls sidebar */}
          <div className="bg-card rounded-lg h-full flex flex-col shadow-sm border border-slate-200">
            <div className="p-6 pt-8 border-b">
              <BackButton onBack={onBack} location="Case" />
              <h1 className="text-xl font-bold text-slate-800 mb-2">
                {caseData.title}
              </h1>
              <p className="text-sm text-slate-600">{caseData.timeframe}</p>

              {/* View selector */}
              {/* <button
                  onClick={() => setSelectedView("month")}
                  className={`w-full flex items-center gap-2 px-3 py-2 border rounded-lg font-medium text-sm ${
                    (selectedView as string) === "month"
                      ? "bg-blue-700 text-white border-blue-700"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  Month View
                </button> */}
              {/* <button
                onClick={() => setSelectedView("timeline")}
                className={`w-full flex items-center gap-2 mt-4 px-3 py-2 border rounded-lg font-medium text-sm ${
                  selectedView === "timeline"
                    ? "bg-blue-700 text-white border-blue-700"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Timeline View
              </button> */}
              {/* </div> */}
            </div>
            <div className="p-6">
              <h3 className="font-semibold text-slate-800 mb-4">
                Event Details
              </h3>
              <div className="flex-1 overflow-y-auto">
                {selectedEvent ? (
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {getEvidenceIcon(selectedEvent.type)}
                        <span className="font-medium">
                          {selectedEvent.title}
                        </span>
                      </div>
                      <div
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${getConfidenceColor(
                          selectedEvent.confidence
                        )}`}
                      >
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {selectedEvent.confidence}% confidence
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">
                        Date & Time
                      </h4>
                      <p className="text-sm text-gray-600">
                        {selectedEvent.date.month === 10 ? "October" : "Month"}{" "}
                        {selectedEvent.date.day}, 2025 at{" "}
                        {formatTime(selectedEvent.time)}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">
                        Evidence Source
                      </h4>
                      <p className="text-sm text-gray-600">
                        {selectedEvent.evidence}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">
                        Description
                      </h4>
                      <p className="text-sm text-gray-600">
                        {selectedEvent.description}
                      </p>
                    </div>
                    <div className="pt-3 ">
                      <Button
                        onClick={() =>
                          onViewEvidence(
                            selectedEvent.evidence,
                            selectedEvent.type
                          )
                        }
                        variant="secondary"
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-700 text-white text-sm rounded-lg hover:bg-blue-800"
                      >
                        <Eye className="w-4 h-4" />
                        View Evidence
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    Click on an event in the timeline to view details
                  </p>
                )}

                {/* Quick stats */}
                <div className="mt-6 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Case Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Events:</span>
                      <span className="font-medium">
                        {filteredEvents.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Video Evidence:</span>
                      <span className="font-medium">
                        {
                          filteredEvents.filter((e) => e.type === "video")
                            .length
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Audio Evidence:</span>
                      <span className="font-medium">
                        {
                          filteredEvents.filter((e) => e.type === "audio")
                            .length
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Witness Accounts:</span>
                      <span className="font-medium">
                        {
                          filteredEvents.filter((e) => e.type === "witness")
                            .length
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 flex flex-col">
            <SwimLaneView />
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentTimeline;
