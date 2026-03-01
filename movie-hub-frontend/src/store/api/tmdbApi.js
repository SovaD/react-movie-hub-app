import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const tmdbApi = createApi({
  reducerPath: "tmdbApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  }),
  endpoints: (builder) => ({
    // Получение списка жанров
    getGenres: builder.query({
      query: () => "/genres",
    }),

    getDiscoverMovies: builder.query({
      query: ({ sortBy, genreId, year, page = 1 }) =>
        `/movies/discover?sort_by=${sortBy}&with_genres=${genreId}&year=${year}&page=${page}`,
    }),

    // Поиск текстом
    searchMovies: builder.query({
      query: ({ query, page = 1 }) =>
        `/movies/search?query=${query}&page=${page}`,
    }),

    // Детали фильма
    getMovieDetails: builder.query({
      query: (id) => `/movies/${id}`,
    }),
    getMoviesByActor: builder.query({
      query: ({ id, page = 1 }) => `/actors/${id}/movies?page=${page}`,
    }),
  }),
});

export const {
  useGetGenresQuery,
  useGetDiscoverMoviesQuery,
  useSearchMoviesQuery,
  useGetMovieDetailsQuery,
  useGetMoviesByActorQuery,
} = tmdbApi;
