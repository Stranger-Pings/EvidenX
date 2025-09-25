import { api } from "./api";

const timelineApi = api.injectEndpoints({
  endpoints: (build) => ({
    getTimeline: build.query<any, { caseId: string }>({
      query: ({ caseId }) => `/timeline/case/${caseId}`,
    }),
  }),
});

export const { useGetTimelineQuery } = timelineApi;