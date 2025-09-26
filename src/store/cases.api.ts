import { api } from './api';
import { Case, Evidence, AudioComparison } from '../types/case';

export interface CaseDto {
  id: string;
  firNumber: string;
  title: string;
  summary: string;
  petitioner: string;
  accused: string;
  investigatingOfficer: string;
  registeredDate: string;
  status: 'Open' | 'In-Progress' | 'Closed';
  visibility: 'Public' | 'Private';
  location: string;
  description?: string;
  created_at: string;
  updated_at: string;
  evidence?: Evidence[];
  audioComparisons?: AudioComparison[];
}

export const casesApi = api.injectEndpoints({
  endpoints: (build) => ({
    getCases: build.query<CaseDto[], void>({
      query: () => '/cases/',
      providesTags: ['Case'],
    }),
    getCaseById: build.query<Case, string>({
      query: (id) => `/cases/${id}`,
      providesTags: (_, __, id) => [{ type: 'Case', id }],
    }),
  }),
});

export const { 
  useGetCasesQuery, 
  useGetCaseByIdQuery
} = casesApi;
