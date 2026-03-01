import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../store/favoritesSlice";

const MovieCard = ({ movie, genresList = [] }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const favoriteItems = useSelector((state) => state.favorites.items);
  const isFavorite = favoriteItems.some((item) => item.id === movie.id);

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "../assets/placeholder.jpg";

  const movieGenres =
    movie.genre_ids
      ?.map((id) => genresList.find((g) => g.id === id))
      .filter(Boolean) || [];

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavorite(movie));
  };

  return (
    <Link
      to={`/movie/${movie.id}`}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
        position: "relative",
        height: "100%",
      }}
    >
      {/* КНОПКА ИЗБРАННОГО */}
      <button
        onClick={handleFavoriteClick}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 10,
          background: "rgba(0,0,0,0.6)",
          border: "none",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          fontSize: "1.5rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: isFavorite ? "#f5c518" : "white",
          transition: "0.2s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {isFavorite ? "♥" : "♡"}
      </button>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          cursor: "pointer",
          height: "100%",
        }}
      >
        <img
          src={imageUrl}
          alt={movie.title}
          style={{
            width: "100%",
            borderRadius: "8px",
            objectFit: "cover",
            flexGrow: 1,
          }}
        />
        <h3 style={{ fontSize: "1rem", margin: 0 }}>{movie.title}</h3>

        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
          {movieGenres.slice(0, 3).map((genre) => (
            <span
              key={genre.id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate("/", { state: { genreId: genre.id } });
              }}
              style={{
                fontSize: "0.75rem",
                backgroundColor: "#333",
                padding: "2px 8px",
                borderRadius: "10px",
                color: "#aaa",
                cursor: "pointer",
              }}
              onMouseOver={(e) => (e.target.style.color = "#fff")}
              onMouseOut={(e) => (e.target.style.color = "#aaa")}
            >
              {genre.name}
            </span>
          ))}
        </div>

        <p style={{ color: "#f5c518", fontWeight: "bold", margin: 0 }}>
          ★ {movie.vote_average?.toFixed(1) || "0.0"} |{" "}
          {movie.release_date?.split("-")[0] || "TBA"}
        </p>
      </div>
    </Link>
  );
};

export default MovieCard;
