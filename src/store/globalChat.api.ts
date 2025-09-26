import { api } from './api';

export interface CaseDto {
  id: string;
  firNumber: string;
  title: string;
  status: 'Open' | 'In-Progress' | 'Closed';
  visibility: 'Public' | 'Private';
}

export const globalChatApi = api.injectEndpoints({
  endpoints: (build) => ({
    sendQuery: build.mutation<any, { caseId: string; query: string }>({
      query: ({ caseId, query }) => `/video/search/${caseId}/query-knowledge-base?query=${encodeURIComponent(query)}`,
    }),
  }),
});

export const { useSendQueryMutation } = globalChatApi; 