import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  useGetMoviesByActorQuery,
  useGetGenresQuery,
} from "../store/api/tmdbApi";
import MovieCard from "../components/MovieCard";

const ActorMovies = () => {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const [displayedMovies, setDisplayedMovies] = useState([]);

  const { data: genresData } = useGetGenresQuery();
  const genresList = genresData?.genres || [];

  const { data, isFetching, error } = useGetMoviesByActorQuery({ id, page });

  // Логика пагинации
  useEffect(() => {
    if (data?.moviesData?.results) {
      if (page === 1) {
        setDisplayedMovies(data.moviesData.results);
      } else {
        setDisplayedMovies((prev) => {
          const newMovies = data.moviesData.results.filter(
            (newMovie) =>
              !prev.some((prevMovie) => prevMovie.id === newMovie.id),
          );
          return [...prev, ...newMovies];
        });
      }
    }
  }, [data]);

  const loadMore = () => setPage((prev) => prev + 1);

  if (error)
    return (
      <h2 style={{ textAlign: "center", color: "red", marginTop: "50px" }}>
        Ошибка загрузки данных
      </h2>
    );

  return (
    <div className="app-container" style={{ marginTop: "20px" }}>
      <Link
        to="/"
        style={{
          color: "#f5c518",
          textDecoration: "none",
          fontSize: "1.1rem",
          display: "inline-block",
          marginBottom: "20px",
        }}
      >
        ← На главную
      </Link>

      {/* Инфа об актере */}
      {data?.actor && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "40px",
            backgroundColor: "#222",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <img
            src={
              data.actor.profile_path
                ? `https://image.tmdb.org/t/p/w200${data.actor.profile_path}`
                : "https://via.placeholder.com/200x300?text=Нет+фото"
            }
            alt={data.actor.name}
            style={{
              width: "100px",
              height: "150px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
          <div>
            <h1 style={{ margin: "0 0 10px 0" }}>{data.actor.name}</h1>
            <p style={{ color: "#aaa", margin: 0 }}>Фильмография актера</p>
          </div>
        </div>
      )}

      {/* Сетка фильмов */}
      <div className="movies-grid">
        {displayedMovies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <MovieCard movie={movie} genresList={genresList} />
          </div>
        ))}
      </div>

      {/* Кнопка Показать еще */}
      {data?.moviesData && page < data.moviesData.total_pages && (
        <div
          style={{
            textAlign: "center",
            marginTop: "40px",
            marginBottom: "40px",
          }}
        >
          <button
            onClick={loadMore}
            disabled={isFetching}
            style={{
              padding: "12px 30px",
              fontSize: "1.2rem",
              borderRadius: "25px",
              backgroundColor: isFetching ? "#555" : "#f5c518",
              color: isFetching ? "#aaa" : "#000",
              border: "none",
              cursor: isFetching ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
          >
            {isFetching ? "Загружаем..." : "Показать еще"}
          </button>
        </div>
      )}

      {isFetching && page === 1 && (
        <h2 style={{ textAlign: "center" }}>Загрузка...</h2>
      )}
    </div>
  );
};

export default ActorMovies;
