import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MovieCard from "../components/MovieCard";

const Favorites = () => {
  const favoriteMovies = useSelector((state) => state.favorites.items);

  return (
    <div className="app-container" style={{ marginTop: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1 style={{ margin: 0 }}>Мое Избранное ♥</h1>
        <Link
          to="/"
          style={{
            color: "#f5c518",
            textDecoration: "none",
            fontSize: "1.1rem",
            fontWeight: "bold",
          }}
        >
          На главную
        </Link>
      </div>

      {favoriteMovies.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "50px", color: "#aaa" }}>
          <h2>Упс, здесь пока пусто!</h2>
          <p>Добавляйте фильмы в избранное, нажимая на сердечко.</p>
        </div>
      ) : (
        <div className="movies-grid">
          {favoriteMovies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
