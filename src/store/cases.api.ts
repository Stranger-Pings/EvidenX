import { api } from './api';

export interface CaseDto {
  id: string;
  firNumber: string;
  title: string;
  status: 'Open' | 'In-Progress' | 'Closed';
  visibility: 'Public' | 'Private';
}

export const casesApi = api.injectEndpoints({
  endpoints: (build) => ({
    getCases: build.query<CaseDto[], void>({
      query: () => '/cases/',
      providesTags: ['Case'],
    }),
  }),
});

export const { useGetCasesQuery } = casesApi;
