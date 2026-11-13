"use client";

import { useEffect, useState } from "react";
import { customerApi, useCustomer } from "./customerSession";

export default function useCustomerData(path) {
  const customer = useCustomer();
  const userId = customer?.id || customer?._id;
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState({});
  useEffect(() => {
    if (!path) return;
    const controller = new AbortController();
    customerApi(path, { signal: controller.signal }).then(
      (data) => { if (!controller.signal.aborted) setResult({ path, userId, revision, data }); },
      (error) => { if (!controller.signal.aborted) setResult({ path, userId, revision, error }); },
    );
    return () => controller.abort();
  }, [path, userId, revision]);
  const current = result.path === path && result.userId === userId;
  return { ...(current ? result : {}), loading: Boolean(path) && (!current || result.revision !== revision), reload: () => setRevision((value) => value + 1) };
}
