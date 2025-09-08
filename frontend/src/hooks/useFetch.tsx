import { useState } from "react";

export const useFetch = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  interface FetchOptions {
    method?: string;
    body?: any;
    headers?: HeadersInit;
  }

  const doFetch = async (
    url: string,
    { method, body, headers }: FetchOptions = { method: "GET" }
  ) => {
    setLoading(true);
    setError(null);

    try {
      const options: RequestInit = {
        method,
        headers: headers || { "Content-Type": "application/json" },
      };

      if (body && method !== "GET") {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}${url}`,
        options
      );

      if (!response.ok) {
        let errorText = await response.json();
        errorText = errorText.message;

        throw new Error(errorText || `HTTP ${response.status}`);
      }

      const json = await response.json();
      setData(json);
      return json; // ✅ allow caller to get result
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, doFetch };
};
