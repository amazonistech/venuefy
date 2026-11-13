"use client";

import { useEffect, useState } from "react";
import { publicApi } from "../lib/publicApi";

export default function usePublicData(path) {
  const [response, setResponse] = useState({});
  useEffect(() => {
    if (!path) return;
    const controller = new AbortController();
    publicApi(path, { signal: controller.signal }).then(
      (data) => {
        if (!controller.signal.aborted) setResponse({ path, data });
      },
      (error) => {
        if (!controller.signal.aborted) setResponse({ path, error });
      },
    );
    return () => controller.abort();
  }, [path]);
  return response.path === path ? response : { loading: Boolean(path) };
}
