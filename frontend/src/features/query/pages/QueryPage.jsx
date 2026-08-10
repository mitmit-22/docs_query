import { useState } from "react";
import { apiFetch } from "../../../lib/api.js";

export default function QueryPage() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const data = await apiFetch("/query", { method: "POST", body: JSON.stringify({ question }) });
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Ask a question</h2>
      <form onSubmit={handleAsk}>
        <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="What is this document about?" required />
        <button type="submit" disabled={loading}>{loading ? "Thinking..." : "Ask"}</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && <p><strong>Answer:</strong> {result.answer}</p>}
    </div>
  );
}