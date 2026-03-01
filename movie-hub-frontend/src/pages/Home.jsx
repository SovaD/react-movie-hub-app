import React, { useState, useEffect } from "react";
import {
  useGetDiscoverMoviesQuery,
  useSearchMoviesQuery,
  useGetGenresQuery,
} from "../store/api/tmdbApi";
import MovieCard from "../components/MovieCard";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import SkeletonCard from "../components/SkeletonCard";

const Home = () => {
  // 1. Состояния
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [displayedMovies, setDisplayedMovies] = useState([]);
  const [filters, setFilters] = useState({
    sortBy: "popularity.desc",
    genreId: "",
    year: "",
  });
  const location = useLocation();
  const favoriteCount = useSelector((state) => state.favorites.items.length);

  useEffect(() => {
    if (location.state?.genreId) {
      setSearchTerm("");
      setFilters((prev) => ({ ...prev, genreId: location.state.genreId }));
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // 2. Сброс страницы при любом изменении фильтров или поиска
  useEffect(() => {
    setPage(1);
    setDisplayedMovies([]);
  }, [searchTerm, filters.sortBy, filters.genreId, filters.year]);

  const { data: genresData } = useGetGenresQuery();
  const genresList = genresData?.genres || [];

  // 3. Запросы к API
  const isSearchActive = searchTerm.length >= 2;

  const { data: discoverData, isFetching: isDiscovering } =
    useGetDiscoverMoviesQuery({ ...filters, page }, { skip: isSearchActive });

  const { data: searchData, isFetching: isSearching } = useSearchMoviesQuery(
    { query: searchTerm, page },
    { skip: !isSearchActive },
  );

  // 4. Логика накопления фильмов
  const currentData = isSearchActive ? searchData : discoverData;
  const isFetching = isSearchActive ? isSearching : isDiscovering;

  useEffect(() => {
    if (currentData?.results) {
      if (currentData.page === 1) {
        setDisplayedMovies(currentData.results);
      } else {
        setDisplayedMovies((prev) => {
          const newMovies = currentData.results.filter(
            (newMovie) =>
              !prev.some((prevMovie) => prevMovie.id === newMovie.id),
          );
          return [...prev, ...newMovies];
        });
      }
    }
  }, [currentData]);

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className="app-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Каталог фильмов</h1>
        <Link
          to="/favorites"
          style={{
            backgroundColor: "#f5c518",
            color: "#000",
            padding: "10px 20px",
            borderRadius: "20px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Избранное ♥ {favoriteCount > 0 && `(${favoriteCount})`}
        </Link>
      </div>

      {/* ПАНЕЛЬ ФИЛЬТРОВ И ПОИСКА */}
      <div
        style={{
          backgroundColor: "#222",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "30px",
        }}
      >
        <input
          type="text"
          placeholder="Поиск по названию..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            marginBottom: "15px",
          }}
        />

        <div
          style={{
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
            opacity: isSearchActive ? 0.3 : 1,
            pointerEvents: isSearchActive ? "none" : "auto",
          }}
        >
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            style={{
              padding: "8px",
              borderRadius: "8px",
              backgroundColor: "#333",
              color: "white",
              border: "none",
            }}
          >
            <option value="popularity.desc">По популярности</option>
            <option value="primary_release_date.desc">Сначала новые</option>
            <option value="primary_release_date.asc">Сначала старые</option>
            <option value="title.asc">По алфавиту (А-Я)</option>
          </select>

          <select
            value={filters.genreId}
            onChange={(e) =>
              setFilters({ ...filters, genreId: e.target.value })
            }
            style={{
              padding: "8px",
              borderRadius: "8px",
              backgroundColor: "#333",
              color: "white",
              border: "none",
            }}
          >
            <option value="">Все жанры</option>
            {genresList.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Год выпуска"
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
            style={{
              padding: "8px",
              borderRadius: "8px",
              backgroundColor: "#333",
              color: "white",
              border: "none",
              width: "120px",
            }}
          />

          <button
            onClick={() => {
              setSearchTerm("");
              setFilters({ sortBy: "popularity.desc", genreId: "", year: "" });
            }}
            style={{
              padding: "8px 15px",
              borderRadius: "8px",
              backgroundColor: "#f5c518",
              color: "#000",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Сбросить
          </button>
        </div>
      </div>

      {/* СПИСОК ФИЛЬМОВ И СКЕЛЕТОНЫ */}
      {isFetching && page === 1 ? (
        <div className="movies-grid">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="movie-card">
              <SkeletonCard />
            </div>
          ))}
        </div>
      ) : (
        <div className="movies-grid">
          {displayedMovies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <MovieCard movie={movie} genresList={genresList} />
            </div>
          ))}
        </div>
      )}

      {/* КНОПКА ЗАГРУЗИТЬ ЕЩЕ */}
      {currentData && currentData.page < currentData.total_pages && (
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
              transition: "all 0.3s",
            }}
          >
            {isFetching ? "Загружаем..." : "Показать еще"}
          </button>
        </div>
      )}

      {/* ЕСЛИ НИЧЕГО НЕ НАЙДЕНО И НЕ ГРУЗИТСЯ */}
      {!isFetching && displayedMovies.length === 0 && (
        <h2 style={{ textAlign: "center" }}>Фильмы не найдены :(</h2>
      )}
    </div>
  );
};

export default Home;
