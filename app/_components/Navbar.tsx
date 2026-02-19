"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`navbar ${solid ? "isSolid" : ""}`}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div className="brand">NETFLIX</div>
        <div className="navLinks">
          <a href="#home">Home</a>
          <a href="#tv">TV Shows</a>
          <a href="#movies">Movies</a>
          <a href="#new">New & Popular</a>
          <a href="#list">My List</a>
        </div>
      </div>

      <div className="navRight">
        <button className="pill" type="button" aria-label="Search">
          Search
        </button>
        <button className="pill" type="button" aria-label="Kids">
          Kids
        </button>
        <div className="avatar" aria-hidden="true" />
      </div>
    </div>
  );
}

