const express = require("express");
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 1. Тестовый роут
app.get("/", (req, res) => res.send("MovieHub Backend is running!"));

// 2. Получение списка всех жанров (Словарь)
app.get("/api/genres", async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.TMDB_BASE_URL}/genre/movie/list`,
      {
        params: { api_key: process.env.TMDB_API_KEY, language: "ru-RU" },
      },
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Ошибка при загрузке жанров" });
  }
});

// 3. Поиск по названию
app.get("/api/movies/search", async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    const response = await axios.get(
      `${process.env.TMDB_BASE_URL}/search/movie`,
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          language: "ru-RU",
          query: query,
          page: page,
        },
      },
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Ошибка при поиске фильма" });
  }
});

// 4. Сортировка и Фильтрация по жанрам/годам
app.get("/api/movies/discover", async (req, res) => {
  try {
    const { sort_by, with_genres, year, page = 1 } = req.query;
    const response = await axios.get(
      `${process.env.TMDB_BASE_URL}/discover/movie`,
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          language: "ru-RU",
          sort_by: sort_by || "popularity.desc",
          with_genres: with_genres || "",
          primary_release_year: year || "",
          page: page,
        },
      },
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Ошибка при фильтрации" });
  }
});

// 5. Детали фильма
app.get("/api/movies/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.TMDB_BASE_URL}/movie/${req.params.id}`,
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          language: "ru-RU",
          append_to_response: "videos,credits",
        },
      },
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Не удалось получить детали фильма" });
  }
});

// 6. Получение фильмов по ID актера
app.get("/api/actors/:id/movies", async (req, res) => {
  try {
    const { page = 1 } = req.query;

    // 1. список фильмов актера
    const moviesResponse = await axios.get(
      `${process.env.TMDB_BASE_URL}/discover/movie`,
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          language: "ru-RU",
          with_cast: req.params.id,
          page: page,
          sort_by: "popularity.desc",
        },
      },
    );

    // 2. Получаем имя самого актера
    const actorResponse = await axios.get(
      `${process.env.TMDB_BASE_URL}/person/${req.params.id}`,
      {
        params: { api_key: process.env.TMDB_API_KEY, language: "ru-RU" },
      },
    );

    res.json({
      actor: actorResponse.data,
      moviesData: moviesResponse.data,
    });
  } catch (error) {
    res.status(500).json({ error: "Ошибка при загрузке фильмов актера" });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту http://localhost:${PORT}`);
});
