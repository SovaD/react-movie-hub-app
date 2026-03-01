import React from "react";

const SkeletonCard = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="skeleton skeleton-img"></div>

      <div className="skeleton skeleton-title"></div>

      <div className="skeleton-tags">
        <div className="skeleton skeleton-tag"></div>
        <div className="skeleton skeleton-tag"></div>
        <div className="skeleton skeleton-tag"></div>
      </div>

      <div className="skeleton skeleton-rating"></div>
    </div>
  );
};

export default SkeletonCard;
