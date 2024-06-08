import { configureStore } from "@reduxjs/toolkit"; // Importing configureStore function from Redux Toolkit

import { articleApi } from "./article"; // Importing articleApi from the article service

export const store = configureStore({
    reducer: {
        [articleApi.reducerPath]: articleApi.reducer, // Adding the articleApi reducer to the store with a custom key
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(articleApi.middleware) // Adding the articleApi middleware to the store middleware stack
});
