import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

const BASE_URL = 'https://pollingservice-addeehfvcxafffb5.centralindia-01.azurewebsites.net';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['User', 'Config', 'VoterData'],
  endpoints: (builder) => ({
    // Authentication
    login: builder.mutation<
      { role: string; activationCode: string; token: string; username: string },
      { identifier: string; password: string; activationCode: string }
    >({
      query: ({ identifier, password, activationCode }) => ({
        url: `/auth/login?identifier=${identifier}&password=${password}&activationCode=${activationCode}`,
        method: 'POST',
      }),
    }),

    // Users
    searchUsers: builder.query<
      {
        activationCode: string;
        candidateAdminId: string;
        candidateAdminUsername: string;
        candidateAdminName: string;
        candidateAdminMobileNumber: string;
        users: Array<{
          userId: string;
          username: string;
          name: string;
          mobileNumber: string;
        }>;
      },
      string
    >({
      query: (activationCode) => `/api/searchUsers?activationCode=${activationCode}`,
      providesTags: ['User'],
    }),

    // Configuration
    saveConfig: builder.mutation<any, Record<string, boolean>>({
      query: (config) => ({
        url: '/api/config',
        method: 'POST',
        body: config,
      }),
      invalidatesTags: ['Config'],
    }),

    // Voter Reports
    getVoterReport: builder.query<any, { activationCode: string; searchTerm?: string }>({
      query: ({ activationCode, searchTerm }) => {
        const params = new URLSearchParams({ activationCode });
        if (searchTerm) params.append('searchTerm', searchTerm);
        return `/api/voter-report?${params.toString()}`;
      },
      providesTags: ['VoterData'],
    }),

    // Booth Locations
    getBoothLocations: builder.query<any, string>({
      query: (activationCode) => `/api/booth-locations?activationCode=${activationCode}`,
      providesTags: ['VoterData'],
    }),
  }),
});

export const {
  useLoginMutation,
  useSearchUsersQuery,
  useSaveConfigMutation,
  useGetVoterReportQuery,
  useGetBoothLocationsQuery,
} = apiSlice;