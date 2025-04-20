import { useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import { useState } from "react";
// import "./Home.css";

export const Home = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const handleJoin = () => {
    if (!name.trim()) return alert("Please enter your name");
    const roomId = uuidV4();
    localStorage.setItem("username", name);
    localStorage.setItem("permission", "write");
    navigate(`/documents/${roomId}`);
  };

  const handleJoinExisting = () => {
    const url = prompt("Paste the shared link here:");
    if (!url) return;
    try {
      const parsedUrl = new URL(url);
      const pathParts = parsedUrl.pathname.split("/");
      const roomId = pathParts[pathParts.length - 1];
      const permission = parsedUrl.searchParams.get("permission") || "write";
      localStorage.setItem("username", name);
      localStorage.setItem("permission", permission);
      navigate(`/documents/${roomId}?permission=${permission}`);
    } catch (err) {
      alert("Invalid URL");
    }
  };

  return (
    <div className="home-container">
      <div className="home-card">
        <h2 className="home-title">Collaborative Document Editor</h2>

        <div className="form-group">
          <label htmlFor="name">Your Name</label>
          <input
            id="name"
            className="form-control"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="button-group">
          <button className="btn btn-primary" onClick={handleJoin}>
            Create New Document
          </button>
          <button className="btn btn-outline-secondary" onClick={handleJoinExisting}>
            Join from Shared Link
          </button>
        </div>
      </div>
    </div>
  );
};
