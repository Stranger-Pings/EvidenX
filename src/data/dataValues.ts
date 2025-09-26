import { Case, Evidence, TimelineEvent, AudioComparison } from "../types/case";

export const dataValuesCases: Case[] = [
  {
    id: "1",
    firNumber: "FIR/2024/001",
    title: "Lady Missing from Kochi Office",
    summary:
      "An employee, Ms. Ananya Mohan, went missing from her workplace at Infopark, Kochi. CCTV footage, witness statements, and digital evidence are being analyzed to trace her last known movements.",
    petitioner: "Mr. Mohan Kumar (Father of Ananya Mohan)",
    accused: "Unknown – investigation ongoing",
    investigatingOfficer: "Inspector Malhotra",
    registeredDate: "2024-01-15",
    status: "In-Progress",
    visibility: "Private",
    location: "Infopark, Kochi",
    description:
      "On the evening of January 14, 2024, Ms. Ananya Mohan, an employee at a software firm in Infopark, Kochi, was reported missing. According to colleagues, she was last seen around 6:45 PM near the office pantry. CCTV footage shows her walking with a cup of tea but no record of her exiting through the main gate was found in the access logs. Witness testimonies reveal conflicting statements regarding whether she left the office premises early or stayed late to complete a report. The investigation team is analyzing long-duration CCTV footage, security access logs, and interrogation recordings to identify inconsistencies, overlaps, and possible leads. Grey areas in statements and missing digital evidence are being closely examined to determine Ananya’s last confirmed movements and potential suspects."
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
    description:
      "A hit-and-run accident involving a pedestrian resulted in serious injury. The investigation involved collecting and analyzing traffic camera footage from the scene, as well as reviewing mobile phone data from the suspect's device. Digital evidence, including access logs and location history, was examined to track the suspect's movements. Through cross-referencing surveillance video with digital records, investigators identified the suspect and established a timeline of events leading up to and following the incident.",
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
    description:
      "A banking fraud involving forged documents and digital manipulation was reported. The investigation involved collecting and analyzing witness testimonies from multiple sources, as well as reviewing digital evidence from the suspect's device. Digital evidence, including access logs and location history, was examined to track the suspect's movements. Through cross-referencing digital records with witness testimonies, investigators identified the suspect and established a timeline of events leading up to and following the incident.",
  },
];

export const dataValuesEvidence: Evidence[] = [
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
    processingStatus: "Processed",
    thumbnail:
      "https://images.unsplash.com/photo-1734812070354-a0af3c243b2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2xpY2UlMjBpbnZlc3RpZ2F0aW9uJTIwZXZpZGVuY2V8ZW58MXx8fHwxNzU4NjkzMzM2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    // id: "6852a8a3-63ed-4392-9edf-28737776b7ce",
    id: '22c99559-efca-4e6b-a0df-75a2a3d15ba9',
    caseId: "1",
    type: "audio",
    name: "Witness Statement - Male Colleague  - Rohan Mehra",
    description: "Audio recording of security guard describing the incident",
    uploadDate: "2024-01-17",
    fileSize: "12 MB",
    processingStatus: "Processed",
    url: "https://evidenx.s3.amazonaws.com/audio/07e89961-523c-4ed5-866f-3cfc2b09d28f.m4a?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIARIALK3APIDCYEXM5%2F20250926%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250926T033101Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=a52ca154d91d790b9ff43022702e8c3f5738cbeda6a104e1ce7954766429a40b",
    duration: "08:45",
    tags: ["witness", "testimony", "security"],
  },
  {
    id: "892a8a3-63ed-4392-9edf-28737776b7ce",
    caseId: "1",
    type: "audio",
    processingStatus: "Processed",
    name: "Witness Statement - Male Colleague - Jacob Mathew ",
    description: "Audio recording of store owner testimony about the incident",
    uploadDate: "2024-01-18",
    fileSize: "15 MB",
    tags: ["witness", "testimony", "victim"],
    duration: "12:30",
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
    name: "Witness Statement - Sameer Khan",
    description: "Audio recording of store owner testimony about the incident",
    uploadDate: "2024-01-18",
    fileSize: "15 MB",
    tags: ["witness", "testimony", "victim"],
    processingStatus: "Processed",
    duration: "12:30",
  },
  {
    id: "882a8a3-63ed-4392-9edf-28737776b7ce",
    caseId: "1",
    type: "audio",
    processingStatus: "Processed",
    name: "Witness Statement - Security Guard",
    description: "Audio recording of store owner testimony about the incident",
    uploadDate: "2024-01-18",
    fileSize: "15 MB",
    tags: ["witness", "testimony", "victim"],
    duration: "12:30",
  },
  {
    id: "872a8a3-63ed-4392-9edf-28737776b7ce",
    caseId: "1",
    type: "audio",
    processingStatus: "Processed",
    name: "Witness Statement - Anuj Patel",
    description: "Audio recording of store owner testimony about the incident",
    uploadDate: "2024-01-18",
    fileSize: "15 MB",
    tags: ["witness", "testimony", "victim"],
    duration: "12:30",
  },
  {
    id: "862a8a3-63ed-4392-9edf-28737776b7ce",
    caseId: "1",
    type: "audio",
    processingStatus: "Processed",
    name: "Witness Statement - Lena Roy",
    description: "Audio recording of store owner testimony about the incident",
    uploadDate: "2024-01-18",
    fileSize: "15 MB",
    tags: ["witness", "testimony", "victim"],
    duration: "12:30",
  },
];

export const dataValuesTimelineEvents: TimelineEvent[] = [
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

export const dataValuesAudioComparisons: AudioComparison[] = [
  {
    id: "d01888db-a20f-4bdc-96e6-00b1fbacd473",
    caseId: "1",
    mediaId1: "22c99559-efca-4e6b-a0df-75a2a3d15ba9",
    mediaId2: "6852a8a3-63ed-4392-9edf-28737776b7ce",
    witnesses: [
      {
        id: "ac1",
        witnessName: "Jacob - Testimony in Ananya Mohan’s Disappearance",
        witnessImage:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        audioId: "c1b1e7d2-87e9-44b4-9e51-22c99559ef11",
        summary:
          "Jacob stated that Ananya appeared perfectly normal, laughing with Sameer as they left the recreation room. He confirmed she had her phone and mentioned heading to the washroom.",
        transcript:
          "I remember leaving the recreation room around 6:40 PM. Ananya was right there with us. She looked perfectly normal, laughing at something on her phone with Sameer. She mentioned going to the washroom before heading back.",
        contradictions: [
          "Anuj described her as distracted and preoccupied, unlike Jacob’s account.",
          "Rohan said she was just scrolling, not laughing with Sameer."
        ],
        similarities: [
          "Confirmed leaving the recreation room together with Ananya.",
          "Confirmed Ananya had her phone with her.",
          "Confirmed Ananya stated she was going to the washroom."
        ],
        grayAreas: []
      },
      {
        id: "ac2",
        witnessName: "Anuj - Testimony in Ananya Mohan’s Disappearance",
        witnessImage:
          "https://images.unsplash.com/photo-1494790108755-2616b2abff16?w=150&h=150&fit=crop&crop=face",
        audioId: "6852a8a3-63ed-4392-9edf-28737776b7ce",
        summary:
          "Anuj recalled that Ananya seemed distracted and preoccupied, almost ignoring them as they left the recreation room. He assumed she might have received a bad message on her phone. He also confirmed she said she was going to the washroom.",
        transcript:
          "When we left the recreation room, Ananya looked distracted, almost like she wasn’t listening to us. She kept checking her phone, and I thought maybe she had received a bad message. She told us she was going to the washroom.",
        contradictions: [
          "Jacob said she was perfectly normal and laughing.",
          "Rohan said she seemed fine and just scrolling, not upset."
        ],
        similarities: [
          "Confirmed leaving the recreation room with Ananya.",
          "Confirmed she had her phone with her.",
          "Confirmed her stated destination was the washroom."
        ],
        grayAreas: [
          "Assumption about a 'bad message' is not verified and may be projection."
        ]
      },
      {
        id: "ac3",
        witnessName: "Rohan - Testimony in Ananya Mohan’s Disappearance",
        witnessImage:
          "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=150&h=150&fit=crop&crop=face",
        audioId: "d8f3a7a2-91b4-46e1-9b72-1ef33c9bb4d2",
        summary:
          "Rohan stated that Ananya seemed fine, casually scrolling her phone, before he left early due to a call. He confirmed they all left the recreation room together.",
        transcript:
          "I left the recreation room with the others, but I had to step out early because I got a call. Ananya looked fine to me, just scrolling on her phone. I didn’t notice anything unusual.",
        contradictions: [
          "Jacob described her as cheerful and laughing.",
          "Anuj described her as distracted and preoccupied."
        ],
        similarities: [
          "Confirmed leaving the recreation room with Ananya.",
          "Confirmed she had her phone with her."
        ],
        grayAreas: [
          "Reason for early departure ('caught a call')—needs verification.",
          "Unclear if he saw anything before leaving that he hasn’t mentioned."
        ]
      },
      {
        id: "ac4",
        witnessName: "Lena - Testimony in Ananya Mohan’s Disappearance",
        witnessImage:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
        audioId: "e1c6d47f-2d45-45d1-8b56-8476c5a72b91",
        summary:
          "Lena reported that when she checked, the washroom was empty and she did not see anyone in a pink top like Ananya was wearing. This contradicts the assumption that Ananya entered the washroom.",
        transcript:
          "I checked the washroom around that time. It was empty, and I definitely didn’t see anyone in a pink top. I don’t think Ananya was in there.",
        contradictions: [
          "Directly contradicts the assumption that Ananya went into the washroom."
        ],
        similarities: [],
        grayAreas: []
      },
      {
        id: "ac5",
        witnessName: "Sameer - Testimony in Ananya Mohan’s Disappearance",
        witnessImage:
          "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop&crop=face",
        audioId: "f3b2f159-7735-4e3c-b073-4a0a9f02a25e",
        summary:
          "Sameer said Ananya showed him something funny on her phone while they were leaving. He stated he turned right just before the washroom corridor to return to his seat.",
        transcript:
          "When we left, Ananya showed me something funny on her phone. She said she was heading to the washroom. I turned right just before the washroom corridor to go back to my desk.",
        contradictions: [
          "Anuj believed Ananya looked distracted and upset, not amused."
        ],
        similarities: [
          "Confirmed leaving the recreation room with Ananya.",
          "Confirmed she had her phone with her.",
          "Confirmed her stated destination was the washroom."
        ],
        grayAreas: [
          "Nature of the 'funny content' is unclear—was it really harmless?",
          "His quick turn towards his desk places him near Ananya’s last known location—needs CCTV verification."
        ]
      }
    ],
    detailedAnalysis: [
      {
        topic: "Group Departure",
        witness1: "Sameer confirmed leaving the recreation room with Ananya.",
        witness2: "Jacob confirmed leaving the recreation room with Ananya.",
        witness3: "Anuj confirmed leaving the recreation room with Ananya.",
        status: "similarity",
        details: "All witnesses consistently reported that Ananya left the recreation room with them.",
        confidence: 95,
        importance: "high"
      },
      {
        topic: "Ananya’s Phone",
        witness1: "Jacob said Ananya was laughing at something with Sameer on her phone.",
        witness2: "Sameer said Ananya was showing him something funny on her phone.",
        witness3: "Anuj said Ananya seemed distracted by a bad message on her phone.",
        status: "similarity",
        details: "All witnesses agree Ananya had her phone and was actively using it.",
        confidence: 90,
        importance: "high"
      },
      {
        topic: "Stated Destination",
        witness1: "Sameer confirmed Ananya said she was heading to the washroom.",
        witness2: "Jacob confirmed Ananya said she was heading to the washroom.",
        witness3: "Anuj confirmed Ananya said she was heading to the washroom.",
        status: "similarity",
        details: "All witnesses confirm Ananya mentioned going to the washroom.",
        confidence: 85,
        importance: "high"
      },
      {
        topic: "Ananya’s Demeanor at Departure",
        witness1: "Jacob described her as 'perfectly normal,' laughing with Sameer.",
        witness2: "Anuj described her as 'distracted, preoccupied, almost ignoring us.'",
        witness3: "Rohan described her as 'seemed fine, just scrolling on her phone.'",
        status: "contradiction",
        details: "Witnesses gave conflicting accounts of Ananya’s mood—ranging from cheerful to distracted to neutral.",
        confidence: 80,
        importance: "critical"
      },
      {
        topic: "Ananya’s Interaction with Phone",
        witness3: "Jacob said she was laughing with Sameer at something on her phone.",
        witness2: "Sameer said she showed him something funny.",
        witness1: "Anuj said she seemed troubled, possibly due to a bad message.",
        status: "contradiction",
        details: "Witnesses disagree on whether Ananya was amused or upset by what she saw on her phone.",
        confidence: 75,
        importance: "high"
      },
      {
        topic: "Washroom Sighting",
        witness1: "Lena stated the washroom was empty and 'definitely no one in a pink top.'",
        witness2: "Earlier assumption was that Ananya entered the washroom.",
        status: "contradiction",
        details: "Lena’s statement directly contradicts the assumption that Ananya entered the washroom.",
        confidence: 85,
        importance: "critical"
      },
      {
        topic: "Sameer’s Immediate Path",
        witness1: "Sameer said he turned right just before the washroom corridor to head to his seat.",
        status: "gray_area",
        details: "Places Sameer very close to Ananya’s last known location. Needs verification against CCTV.",
        confidence: 70,
        importance: "high"
      },
      {
        topic: "Rohan’s Early Departure",
        witness1: "Rohan said he left early due to a call he received.",
        status: "gray_area",
        details: "Unclear if the call was legitimate or if Rohan saw something he isn’t revealing.",
        confidence: 65,
        importance: "medium"
      },
      {
        topic: "Anuj’s Assumption about a Bad Message",
        witness1: "Anuj assumed Ananya looked distracted because of a bad message on her phone.",
        status: "gray_area",
        details: "This is Anuj’s interpretation, not confirmed by evidence. Needs further probing.",
        confidence: 60,
        importance: "medium"
      }
    ],
    created_at: "2025-09-25T17:19:21.666615Z",
    updated_at: "2025-09-25T17:19:21.666615Z",
  },
];
