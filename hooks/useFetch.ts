"use client";

import { useState } from "react";
import { toast } from "sonner";

interface UseFetchState<T> {
  data: T | undefined;
  loading: boolean;
  error: Error | null;
  fn: (...args: unknown[]) => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<T | undefined>>;
}

/**
 * Custom hook for calling server actions with loading, error, and data state.
 * Automatically shows error toasts via Sonner.
 *
 * @param cb - The server action to call
 * @returns { data, loading, error, fn, setData }
 */
export function useFetch<T, Args extends unknown[] = unknown[]>(
  cb: (...args: Args) => Promise<T>
): UseFetchState<T> {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fn = async (...args: unknown[]): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const result = await cb(...(args as Args));
      setData(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
}