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
import { useGetTimelineQuery } from "@/store/timeline.api";
import { TimelineEvent as ApiTimelineEvent } from "@/types/case";

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
  caseId,
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

  const { data: timeLineData } = useGetTimelineQuery({ caseId });
  console.log(timeLineData);

  const mappedEvents: Event[] = useMemo(() => {
    if (!timeLineData || !Array.isArray(timeLineData)) return [];
    return (timeLineData as any[]).map((ev, index) => {
      if ("time" in ev && "date" in ev) {
        const e = ev as Event;
        return {
          ...e,
          time: Number(e.time),
          duration: Number(e.duration),
        } as Event;
      }
      const api = ev as ApiTimelineEvent;
      const dateObj = new Date(api.timestamp as unknown as string);
      const month = dateObj.getMonth() + 1;
      const day = dateObj.getDate();
      const hours = dateObj.getHours();
      const minutes = dateObj.getMinutes();
      const time = hours + minutes / 60;
      const type: Event["type"] =
        api.evidenceType === "video"
          ? "video"
          : api.evidenceType === "audio"
          ? "audio"
          : "witness";
      const actor =
        type === "video"
          ? "suspect1"
          : type === "audio"
          ? "witness1"
          : "victim1";

      return {
        id: index + 1,
        time,
        duration: 0.5,
        actor,
        date: { day, month },
        title: api.title,
        type,
        confidence: 80,
        evidence: api.evidenceId || api.source,
        description: api.description,
      };
    });
  }, [timeLineData]);

  const incidentDates: DateInfo[] = useMemo(() => {
    const unique = new Set<string>();
    mappedEvents.forEach((e) => {
      unique.add(`${e.date.month}-${e.date.day}`);
    });
    const result = Array.from(unique).map((key) => {
      const [month, day] = key.split("-").map((v) => parseInt(v, 10));
      return { day, month } as DateInfo;
    });
    result.sort((a, b) => a.month - b.month || a.day - b.day);
    return result;
  }, [mappedEvents]);

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
        id: "suspect2",
        name: "Accomplice",
        color: "#f97316",
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
      {
        id: "location1",
        name: "Bank Branch",
        color: "#6b7280",
        type: "location",
      },
    ],
    incidentDates: incidentDates,
    events: mappedEvents,
  };

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

  useEffect(() => {
    if (mappedEvents.length > 0 && !selectedDate) {
      setCurrentMonth(mappedEvents[0].date.month);
    }
  }, [mappedEvents, selectedDate]);

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
      </div>
    </div>
  );

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
