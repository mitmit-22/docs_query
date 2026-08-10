import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch, apiUpload } from "../../../lib/api.js";

export default function DocumentsPage() {
  const [document, setDocument] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const fetchCurrent = async () => {
    try {
      const data = await apiFetch("/documents/me");
      setDocument(data);
    } catch {
      setDocument(null);
    }
  };

  useEffect(() => { fetchCurrent(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setError("");
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const data = await apiUpload("/documents", formData);
      setDocument(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDiscard = async () => {
    try {
      await apiFetch("/documents/me", { method: "DELETE" });
      setDocument(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Your Document</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {document ? (
        <div>
          <p>Current: {document.filename} ({document.status})</p>
          <button onClick={handleDiscard}>Discard</button>{" "}
          <Link to="/query">Ask questions</Link>
        </div>
      ) : (
        <form onSubmit={handleUpload}>
          <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
          <button type="submit" disabled={uploading}>{uploading ? "Uploading..." : "Upload"}</button>
        </form>
      )}
    </div>
  );
}