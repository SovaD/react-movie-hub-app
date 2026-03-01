import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "15vh", padding: "0 20px" }}>
      <h1
        style={{
          fontSize: "8rem",
          color: "#f5c518",
          margin: "0 0 20px 0",
          lineHeight: "1",
        }}
      >
        404
      </h1>
      <h2 style={{ fontSize: "2rem", marginBottom: "15px" }}>
        Упс! Кина не будет 🎬
      </h2>
      <p style={{ color: "#aaa", fontSize: "1.2rem", marginBottom: "40px" }}>
        Кажется, вы забрели не туда. Такой страницы не существует или она была
        удалена.
      </p>

      <Link
        to="/"
        style={{
          padding: "15px 35px",
          fontSize: "1.2rem",
          borderRadius: "30px",
          backgroundColor: "#f5c518",
          color: "#000",
          textDecoration: "none",
          fontWeight: "bold",
          transition: "all 0.3s ease",
          display: "inline-block",
        }}
        onMouseOver={(e) => {
          e.target.style.transform = "scale(1.05)";
          e.target.style.backgroundColor = "#e0b416";
        }}
        onMouseOut={(e) => {
          e.target.style.transform = "scale(1)";
          e.target.style.backgroundColor = "#f5c518";
        }}
      >
        Вернуться на главную
      </Link>
    </div>
  );
};

export default NotFound;
