import { Case, Evidence, TimelineEvent, AudioComparison } from "../types/case";

export const mockCases: Case[] = [
  {
    id: "1",
    firNumber: "FIR/2024/001",
    title: "Commercial Property Theft Investigation",
    summary:
      "Multiple break-ins at commercial complex. CCTV footage and witness testimonies collected. Suspects identified through digital evidence.",
    petitioner: "Metro Shopping Complex Ltd.",
    accused: "John Doe, Jane Smith",
    investigatingOfficer: "Inspector Sarah Williams",
    registeredDate: "2024-01-15",
    status: "In-Progress",
    visibility: "Private",
    location: "Mumbai Central",
  },
  {
    id: "2",
    firNumber: "FIR/2024/002",
    title: "Vehicle Accident Investigation",
    summary:
      "Hit-and-run case involving pedestrian injury. Traffic camera footage and mobile phone evidence under analysis.",
    petitioner: "State Traffic Department",
    accused: "Unknown Driver",
    investigatingOfficer: "Sub-Inspector Raj Patel",
    registeredDate: "2024-01-20",
    status: "Open",
    visibility: "Public",
    location: "Delhi North",
  },
  {
    id: "3",
    firNumber: "FIR/2024/003",
    title: "Fraud Investigation - Financial",
    summary:
      "Banking fraud involving forged documents and digital manipulation. Multiple witness testimonies recorded.",
    petitioner: "Union Bank of India",
    accused: "Michael Johnson",
    investigatingOfficer: "Inspector Priya Sharma",
    registeredDate: "2024-02-01",
    status: "Closed",
    visibility: "Private",
    location: "Bangalore Urban",
  },
];

export const mockEvidence: Evidence[] = [
  {
    id: "ev1",
    caseId: "1",
    type: "video",
    name: "CCTV Footage - Main Entrance",
    description:
      "Security camera footage from main entrance showing suspects entering building",
    uploadDate: "2024-01-16",
    fileSize: "245 MB",
    tags: ["surveillance", "suspects", "entrance"],
    duration: "02:34:15",
    thumbnail:
      "https://images.unsplash.com/photo-1734812070354-a0af3c243b2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2xpY2UlMjBpbnZlc3RpZ2F0aW9uJTIwZXZpZGVuY2V8ZW58MXx8fHwxNzU4NjkzMzM2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    // id: "6852a8a3-63ed-4392-9edf-28737776b7ce",
    id: '22c99559-efca-4e6b-a0df-75a2a3d15ba9',
    caseId: "1",
    type: "audio",
    name: "Witness Statement - Security Guard",
    description: "Audio recording of security guard describing the incident",
    uploadDate: "2024-01-17",
    fileSize: "12 MB",
    url: "https://evidenx.s3.us-east-1.amazonaws.com/audio/07e89961-523c-4ed5-866f-3cfc2b09d28f.m4a?response-content-disposition=inline&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIHmXV9VhZhEPWrnz1CsEgHb%2BvuTEiQJQL8tDf30GLAOQAiB3BBZEc7jOmzne%2B5FWKACHBwi08AJAaDtXhGb3cVgW1Sr9Agh5EAEaDDA4NTkyMzEyNTI3OCIM6DIVmOoExdni%2BoiOKtoCZWhMZDihXbwyLgJIL9XOP74C85wryE%2BxokLjh%2F3T2qpaPexPoFgSipbDRdGnXGDg3nXd8NmrqpqVztlnm%2BnSrY6Rq0qAIZqEhBjSGPauY5q4eAlVgUSRTn3bOmrXBSuW5L%2F8GUoGDIkJkP%2FUhJVNR2gGQhh3bZqtDy8LgfjshSjrNTvc0c4gV6UMAOBjpYEcOv5h8bGBNAPRNT2YgKau%2BXm2gDM%2Fd2Tg1j8T7%2BGp1gSkKjzho0536Kim%2FG6D1GAeinAnMDq%2BdqVPvcJqfRTwgsVBWKxWLu3D0X1BJzF7Ne3K98jDe6xnvP3Ud4VHpuDjrZcLKB28kQhbXWffQbrp07HpyAh5rL2SELMDEVMxTP86LCPLJ5HpcFshaFvuWPGmjwIuYTWiZahlgKmvWULLfnXPaVWw51bdPqOx1Dsz3dwRltDejPO42bAFXEK9jzRPfo7f5%2BK0KLsYLjD3pNTGBjqQAm%2BAbAkoEm4nMh%2BIWj4OLGC9DT%2FUaB%2FX9GCne1drGtaZf9WLosqulKI3j2%2BUnjbKfMJ4XvgNy7K%2Fp6vI7wEMfW%2Fa%2Fz3AzBQ0%2BPijY7crw%2Bm2vBQFP3cwhhP9nG5YyNU3Fyzzp3f9TJet%2Blfr7PwKOEDNvoEb%2FbTyY3vF2NtKQ0K4Eg18gl9w4znMJJZGAgm43ovr1pabWP%2BZGOLiDJUDzVyzyYRhYYlsoE%2BXYrW2zibJg2W%2F2wtRKHDNHd70r1%2Fs9zvCtDNDh1UOTSLmqyANwT11FRaA%2FtOPk57FWYoUgE4l0uJ%2FTRGe2Fm1K8XeySdbtheqZb7%2FCG5MPfRgO9g8e%2FYNEZvbdqAy%2BgSrDDEUdqwx&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIARIALK3APK6WXCUNJ%2F20250925%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250925T153953Z&X-Amz-Expires=43200&X-Amz-SignedHeaders=host&X-Amz-Signature=469234f734fadaa9879252b193b34567157652275654cd8079aea5662b82d3e9",
    duration: "08:45",
    tags: ["witness", "testimony", "security"],
  },
  {
    id: "ev3",
    caseId: "1",
    type: "document",
    name: "Police Report - Initial Investigation",
    description:
      "Initial police report with preliminary findings and evidence list",
    uploadDate: "2024-01-15",
    fileSize: "2.3 MB",
    tags: ["official", "preliminary", "report"],
    thumbnail:
      "https://images.unsplash.com/photo-1731074803846-ac506947040d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXclMjBlbmZvcmNlbWVudCUyMGRvY3VtZW50JTIwZmlsZXN8ZW58MXx8fHwxNzU4NjkzMzQwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "6852a8a3-63ed-4392-9edf-28737776b7ce",
    caseId: "1",
    type: "audio",
    name: "Witness Statement - Store Owner",
    description: "Audio recording of store owner testimony about the incident",
    uploadDate: "2024-01-18",
    fileSize: "15 MB",
    tags: ["witness", "testimony", "victim"],
    duration: "12:30",
  },
];

export const mockTimelineEvents: TimelineEvent[] = [
  {
    id: "te1",
    caseId: "1",
    timestamp: "2024-01-15T09:00:00Z",
    title: "Case Registered",
    description: "FIR filed by Metro Shopping Complex management",
    source: "case_diary",
  },
  {
    id: "te2",
    caseId: "1",
    timestamp: "2024-01-15T14:30:00Z",
    title: "Initial Site Inspection",
    description: "Crime scene examined, preliminary evidence collected",
    source: "case_diary",
  },
  {
    id: "te3",
    caseId: "1",
    timestamp: "2024-01-16T10:15:00Z",
    title: "CCTV Footage Retrieved",
    description: "Security camera footage from main entrance collected",
    evidenceId: "ev1",
    evidenceType: "video",
    source: "video",
  },
  {
    id: "te4",
    caseId: "1",
    timestamp: "2024-01-17T11:00:00Z",
    title: "Security Guard Interview",
    description: "Witness statement recorded from on-duty security guard",
    evidenceId: "ev2",
    evidenceType: "audio",
    source: "audio",
  },
];

export const mockAudioComparisons: AudioComparison[] = [
  {
    id: "d01888db-a20f-4bdc-96e6-00b1fbacd473",
    caseId: "1",
    mediaId1: "22c99559-efca-4e6b-a0df-75a2a3d15ba9",
    mediaId2: "6852a8a3-63ed-4392-9edf-28737776b7ce",
    witnesses: [
      {
        id: "ac1",
        witnessName: "Investigation into Sarah Green's Disappearance",
        witnessImage:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        audioId: "22c99559-efca-4e6b-a0df-75a2a3d15ba9",
        summary:
          "The witness last saw Sarah Green at 6 PM near the old life. Sarah mentioned she was going to meet a friend at a cafe on Main Street and appeared nervous as if she was being followed.",
        transcript:
          "i saw her yesterday i found six in the evening near the old life. she said she was heading to meet a friend at the cafe on main street. she seemed nervous like she was being followed.",
        contradictions: [],
        similarities: [
          "Witness 2 saw Sarah at the same time and location, and noted similar behavior.",
        ],
        grayAreas: ["The term 'old life' is unclear and could be ambiguous."],
      },
      {
        id: "ac2",
        witnessName: "Investigation into Sarah Green's Disappearance",
        witnessImage:
          "https://images.unsplash.com/photo-1494790108755-2616b2abff16?w=150&h=150&fit=crop&crop=face",
        audioId: "6852a8a3-63ed-4392-9edf-28737776b7ce",
        summary:
          "The witness last saw Sarah Green at 6 PM near the old life. Sarah mentioned she was going to meet a friend at a cafe on Main Street and appeared nervous as if she was being followed.",
        transcript:
          "i saw her yesterday i found six in the evening near the old life. she said she was heading to meet a friend at the cafe on main street. she seemed nervous like she was being followed.",
        contradictions: [],
        similarities: [
          "Witness 1 saw Sarah at the same time and location, and noted similar behavior.",
        ],
        grayAreas: ["The term 'old life' is unclear and could be ambiguous."],
      },
    ],
    detailedAnalysis: [
      {
        topic: "Time and location of last sighting",
        witness1: "Witness 1 saw Sarah at 6 PM near the old life.",
        witness2: "Witness 2 saw Sarah at 6 PM near the old life.",
        status: "similarity",
        details:
          "Both witnesses reported seeing Sarah at the same time and location.",
        confidence: 95,
        importance: "high",
      },
      {
        topic: "Sarah's destination and behavior",
        witness1:
          "Sarah was going to meet a friend at a cafe on Main Street and seemed nervous.",
        witness2:
          "Sarah was going to meet a friend at a cafe on Main Street and seemed nervous.",
        status: "similarity",
        details:
          "Both witnesses reported the same destination and noted Sarah's nervous behavior.",
        confidence: 90,
        importance: "high",
      },
    ],
    created_at: "2025-09-25T17:19:21.666615Z",
    updated_at: "2025-09-25T17:19:21.666615Z",
  },
];
