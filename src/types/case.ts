export interface Case {
  id: string;
  firNumber: string;
  title: string;
  summary: string;
  petitioner: string;
  accused: string;
  investigatingOfficer: string;
  registeredDate: string;
  status: "Open" | "In-Progress" | "Closed";
  visibility: "Public" | "Private";
  location: string;
  description: string;
}

export interface Evidence {
  id: string;
  caseId: string;
  type: "document" | "image" | "video" | "audio" | "digital";
  name: string;
  url?: string;
  description: string;
  uploadDate: string;
  fileSize: string;
  tags: string[];
  thumbnail?: string;
  duration?: string; // for audio/video
}

export interface TimelineEvent {
  id: string;
  caseId: string;
  timestamp: string;
  title: string;
  description: string;
  evidenceId?: string;
  evidenceType?: Evidence["type"];
  source: "case_diary" | "video" | "audio" | "document";
}

export interface ChatMessage {
  id: string;
  message: string;
  response: string;
  timestamp: string;
  videoTimestamps?: number[];
  audioTimestamps?: number[];
}

export interface Witness {
  id: string;
  witnessName: string;
  witnessImage: string;
  audioId: string;
  summary: string;
  transcript: string;
  contradictions: string[];
  similarities: string[];
  grayAreas: string[];
}

export interface DetailedAnalysisItem {
  topic: string;
  witness1: string;
  witness2: string;
  status: "similarity" | "contradiction" | "gray_area";
  details: string;
  confidence?: number;
  importance?: "high" | "medium" | "low";
}

export interface AudioComparison {
  id: string;
  caseId: string;
  mediaId1: string;
  mediaId2: string;
  witnesses: Witness[];
  detailedAnalysis: DetailedAnalysisItem[];
  created_at: string;
  updated_at: string;
}
