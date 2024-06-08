import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const rapidApiKey = import.meta.env.VITE_RAPID_API_ARTICLE_KEY; // API key stored in environment variables

export const articleApi = createApi({
    reducerPath: 'articleApi', // Path to store the reducer for the article API
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://article-extractor-and-summarizer.p.rapidapi.com/', // Base URL for the RapidAPI endpoint
        prepareHeaders: (headers) => {
            headers.set('X-RapidAPI-Key', rapidApiKey); // Setting API key in the request headers
            headers.set('X-RapidAPI-Host', 'article-extractor-and-summarizer.p.rapidapi.com'); // Setting host in the request headers

            return headers;
        },
    }),
    endpoints: (builder) => ({
        getSummary: builder.query({
            // Defining a query endpoint named getSummary
            query: (params) => `summarize?url=${encodeURIComponent(params.articleUrl)}&length=3`, // Building the query URL with the article URL parameter encoded
        }),
    }),
});

export const { useLazyGetSummaryQuery } = articleApi; // Exporting the hook to use the lazy getSummary query
