import { configureStore } from "@reduxjs/toolkit";
import { tmdbApi } from "./api/tmdbApi";
import favoritesReducer from "./favoritesSlice";

export const store = configureStore({
  reducer: {
    [tmdbApi.reducerPath]: tmdbApi.reducer,
    favorites: favoritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tmdbApi.middleware),
});
