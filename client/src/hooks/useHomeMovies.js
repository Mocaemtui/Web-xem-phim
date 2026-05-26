import { useEffect, useState } from "react";
import { getHomeRows } from "../services/sourceManager";

export function useHomeMovies() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function load() {
    try {
      setStatus("loading");
      setError("");

      const data = await getHomeRows();

      setRows(data);
      setStatus("success");
    } catch (err) {
      setRows([]);
      setError(err.message || "Không lấy được nguồn phim");
      setStatus("error");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return {
    rows,
    status,
    error,
    reload: load,
  };
}
