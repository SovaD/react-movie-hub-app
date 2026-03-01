import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useGetMovieDetailsQuery } from "../store/api/tmdbApi";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: movie, error, isLoading } = useGetMovieDetailsQuery(id);

  if (isLoading)
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>Загрузка...</h2>
    );
  if (error)
    return (
      <h2 style={{ color: "red", textAlign: "center" }}>
        Ошибка при загрузке!
      </h2>
    );

  // ссылки на постер и ищем трейлер
  const imageUrl = movie?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "../assets/placeholder.jpg";
  const trailer = movie?.videos?.results?.find(
    (vid) => vid.site === "YouTube" && vid.type === "Trailer",
  );
  const cast = movie?.credits?.cast?.slice(0, 10) || [];

  return (
    <div className="app-container" style={{ marginTop: "20px" }}>
      {/* Кнопка Назад */}
      <Link
        to="/"
        style={{
          color: "#f5c518",
          textDecoration: "none",
          fontSize: "1.1rem",
          marginBottom: "20px",
          display: "inline-block",
        }}
      >
        ← Назад к списку
      </Link>

      <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
        {/* Постер фильма */}
        <img
          src={imageUrl}
          alt={movie?.title}
          style={{
            width: "100%",
            maxWidth: "350px",
            borderRadius: "12px",
            objectFit: "cover",
          }}
        />

        {/* Инфо блок */}
        <div style={{ flex: "1", minWidth: "300px" }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>
            {movie?.title}
          </h1>

          <p
            style={{
              color: "#f5c518",
              fontSize: "1.2rem",
              fontWeight: "bold",
              marginBottom: "15px",
            }}
          >
            ★ {movie?.vote_average?.toFixed(1)} |{" "}
            {movie?.release_date?.split("-")[0]}
          </p>

          {/* КЛИКАБЕЛЬНЫЕ ЖАНРЫ */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginBottom: "20px",
            }}
          >
            {movie?.genres?.map((genre) => (
              <span
                key={genre.id}
                onClick={() => navigate("/", { state: { genreId: genre.id } })}
                style={{
                  border: "1px solid #555",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  color: "white",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#f5c518";
                  e.target.style.color = "#000";
                  e.target.style.borderColor = "#f5c518";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "white";
                  e.target.style.borderColor = "#555";
                }}
              >
                {genre.name}
              </span>
            ))}
          </div>

          {/* Описание */}
          <p style={{ lineHeight: "1.7", fontSize: "1.1rem", color: "#ddd" }}>
            {movie?.overview || "Описание отсутствует."}
          </p>

          {/* ТРЕЙЛЕР  */}
          {trailer && (
            <div style={{ marginTop: "30px" }}>
              <h3>Трейлер</h3>
              <iframe
                width="100%"
                height="315"
                src={`https://www.youtube-nocookie.com/embed/${trailer.key}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  borderRadius: "12px",
                  marginTop: "10px",
                  maxWidth: "560px",
                }}
              ></iframe>
            </div>
          )}
        </div>
      </div>

      {/* СПИСОК АКТЕРОВ */}
      {cast.length > 0 && (
        <div style={{ marginTop: "50px" }}>
          <h2>В главных ролях</h2>
          <div
            className="horizontal-scroll"
            style={{
              display: "flex",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            {cast.map((actor) => (
              <Link
                to={`/actor/${actor.id}`}
                key={actor.id}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  textAlign: "center",
                  minWidth: "120px",
                }}
              >
                <img
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                      : "https://via.placeholder.com/200x300?text=Фото+нет"
                  }
                  alt={actor.name}
                  style={{
                    width: "120px",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    marginBottom: "10px",
                    transition: "transform 0.2s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                />
                <h4 style={{ fontSize: "0.9rem", margin: 0 }}>{actor.name}</h4>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "#888",
                    margin: "5px 0 0 0",
                  }}
                >
                  {actor.character}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
