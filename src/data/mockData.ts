import { Case, Evidence, TimelineEvent, AudioComparison } from '../types/case';

export const mockCases: Case[] = [
  {
    id: '1',
    firNumber: 'FIR/2024/001',
    title: 'Commercial Property Theft Investigation',
    summary: 'Multiple break-ins at commercial complex. CCTV footage and witness testimonies collected. Suspects identified through digital evidence.',
    petitioner: 'Metro Shopping Complex Ltd.',
    accused: 'John Doe, Jane Smith',
    investigatingOfficer: 'Inspector Sarah Williams',
    registeredDate: '2024-01-15',
    status: 'In-Progress',
    visibility: 'Private',
    location: 'Mumbai Central'
  },
  {
    id: '2',
    firNumber: 'FIR/2024/002',
    title: 'Vehicle Accident Investigation',
    summary: 'Hit-and-run case involving pedestrian injury. Traffic camera footage and mobile phone evidence under analysis.',
    petitioner: 'State Traffic Department',
    accused: 'Unknown Driver',
    investigatingOfficer: 'Sub-Inspector Raj Patel',
    registeredDate: '2024-01-20',
    status: 'Open',
    visibility: 'Public',
    location: 'Delhi North'
  },
  {
    id: '3',
    firNumber: 'FIR/2024/003',
    title: 'Fraud Investigation - Financial',
    summary: 'Banking fraud involving forged documents and digital manipulation. Multiple witness testimonies recorded.',
    petitioner: 'Union Bank of India',
    accused: 'Michael Johnson',
    investigatingOfficer: 'Inspector Priya Sharma',
    registeredDate: '2024-02-01',
    status: 'Closed',
    visibility: 'Private',
    location: 'Bangalore Urban'
  }
];

export const mockEvidence: Evidence[] = [
  {
    id: 'ev1',
    caseId: '1',
    type: 'video',
    name: 'CCTV Footage - Main Entrance',
    description: 'Security camera footage from main entrance showing suspects entering building',
    uploadDate: '2024-01-16',
    fileSize: '245 MB',
    tags: ['surveillance', 'suspects', 'entrance'],
    duration: '02:34:15',
    thumbnail: 'https://images.unsplash.com/photo-1734812070354-a0af3c243b2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2xpY2UlMjBpbnZlc3RpZ2F0aW9uJTIwZXZpZGVuY2V8ZW58MXx8fHwxNzU4NjkzMzM2fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'ev2',
    caseId: '1',
    type: 'audio',
    name: 'Witness Statement - Security Guard',
    description: 'Audio recording of security guard describing the incident',
    uploadDate: '2024-01-17',
    fileSize: '12 MB',
    tags: ['witness', 'testimony', 'security'],
    duration: '08:45'
  },
  {
    id: 'ev3',
    caseId: '1',
    type: 'document',
    name: 'Police Report - Initial Investigation',
    description: 'Initial police report with preliminary findings and evidence list',
    uploadDate: '2024-01-15',
    fileSize: '2.3 MB',
    tags: ['official', 'preliminary', 'report'],
    thumbnail: 'https://images.unsplash.com/photo-1731074803846-ac506947040d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXclMjBlbmZvcmNlbWVudCUyMGRvY3VtZW50JTIwZmlsZXN8ZW58MXx8fHwxNzU4NjkzMzQwfDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'ev4',
    caseId: '1',
    type: 'audio',
    name: 'Witness Statement - Store Owner',
    description: 'Audio recording of store owner testimony about the incident',
    uploadDate: '2024-01-18',
    fileSize: '15 MB',
    tags: ['witness', 'testimony', 'victim'],
    duration: '12:30'
  }
];

export const mockTimelineEvents: TimelineEvent[] = [
  {
    id: 'te1',
    caseId: '1',
    timestamp: '2024-01-15T09:00:00Z',
    title: 'Case Registered',
    description: 'FIR filed by Metro Shopping Complex management',
    source: 'case_diary'
  },
  {
    id: 'te2',
    caseId: '1',
    timestamp: '2024-01-15T14:30:00Z',
    title: 'Initial Site Inspection',
    description: 'Crime scene examined, preliminary evidence collected',
    source: 'case_diary'
  },
  {
    id: 'te3',
    caseId: '1',
    timestamp: '2024-01-16T10:15:00Z',
    title: 'CCTV Footage Retrieved',
    description: 'Security camera footage from main entrance collected',
    evidenceId: 'ev1',
    evidenceType: 'video',
    source: 'video'
  },
  {
    id: 'te4',
    caseId: '1',
    timestamp: '2024-01-17T11:00:00Z',
    title: 'Security Guard Interview',
    description: 'Witness statement recorded from on-duty security guard',
    evidenceId: 'ev2',
    evidenceType: 'audio',
    source: 'audio'
  }
];

export const mockAudioComparisons: AudioComparison[] = [
  {
    id: 'ac1',
    witnessName: 'Rajesh Kumar (Security Guard)',
    witnessImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    audioId: 'ev2',
    summary: 'Security guard describes seeing two individuals enter through main entrance around 2:30 AM. Mentions suspicious behavior and unfamiliar faces.',
    transcript: 'I was on duty that night when I saw two people coming through the main gate. They looked suspicious, wearing dark clothes and caps. I tried to question them but they rushed inside.',
    contradictions: ['Time mentioned differs from CCTV timestamp'],
    similarities: ['Confirms two suspects', 'Dark clothing description matches video'],
    grayAreas: ['Unclear about exact location of entry']
  },
  {
    id: 'ac2',
    witnessName: 'Meera Patel (Store Owner)',
    witnessImage: 'https://images.unsplash.com/photo-1494790108755-2616b2abff16?w=150&h=150&fit=crop&crop=face',
    audioId: 'ev4',
    summary: 'Store owner discovered the break-in next morning. Describes missing inventory and damaged property. Provides details about security arrangements.',
    transcript: 'When I arrived at 9 AM, I found the lock broken and items missing from the store. The cash register was tampered with and several electronic items were gone.',
    contradictions: ['Claims to have CCTV inside store but no footage found'],
    similarities: ['Confirms break-in occurred overnight', 'Missing items match reported theft'],
    grayAreas: ['Uncertain about exact time of discovery']
  }
];