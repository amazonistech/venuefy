function getToken() {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("token") || localStorage.getItem("accessToken") || ""
  );
}

function getBackendUrl() {
  return (process.env.NEXT_PUBLIC_BACKEND_SERVER || "").replace(/\/$/, "");
}

async function parseResponse(response) {
  let data = {};

  try {
    data = await response.json();
  } catch (error) {
    console.log(error)
    data = {};
  }

  return { response, data };
}

async function request(url, options = {}) {
  let headers = { ...(options.headers || {}) };
  let token = getToken();

  if (!options.isMultipart) {
    headers["content-type"] = headers["content-type"] || "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response = await fetch(`${getBackendUrl()}${url}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (
    response.status === 401 &&
    !options.skipRefresh &&
    url !== "/auth/refresh-token" &&
    typeof window !== "undefined"
  ) {
    let refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      let refreshResponse = await fetch(
        `${getBackendUrl()}/auth/refresh-token`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ refreshToken }),
          credentials: "include",
        },
      );

      let refreshData = await refreshResponse.json().catch(() => ({}));
      let accessToken = refreshData?.data?.accessToken;

      if (refreshResponse.ok && refreshData?.result !== "Fail" && accessToken) {
        localStorage.setItem("token", accessToken);
        localStorage.setItem("accessToken", accessToken);

        if (refreshData?.data?.refreshToken) {
          localStorage.setItem("refreshToken", refreshData.data.refreshToken);
        }

        headers.Authorization = `Bearer ${accessToken}`;

        response = await fetch(`${getBackendUrl()}${url}`, {
          ...options,
          headers,
          credentials: "include",
        });
      }
    }
  }

  return parseResponse(response);
}

export async function createRecord(collection, payload) {
  try {
    return await request(`/${collection}`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.log(error);

    return {
      response: { ok: false },
      data: { result: "Fail", reason: error.message },
    };
  }
}

export async function createMultipartRecord(collection, payload) {
  try {
    return await request(`/${collection}`, {
      method: "POST",
      body: payload,
      isMultipart: true,
    });
  } catch (error) {
    console.log(error);

    return {
      response: { ok: false },
      data: { result: "Fail", reason: error.message },
    };
  }
}

export async function getRecord(collection, query = "") {
  try {
    return await request(`/${collection}${query ? `?${query}` : ""}`, {
      method: "GET",
    });
  } catch (error) {
    console.log(error);

    return {
      response: { ok: false },
      data: { result: "Fail", reason: error.message },
    };
  }
}

export async function getRecordById(collection, id) {
  try {
    return await request(`/${collection}/${id}`, {
      method: "GET",
    });
  } catch (error) {
    console.log(error);

    return {
      response: { ok: false },
      data: { result: "Fail", reason: error.message },
    };
  }
}

export async function updateRecord(collection, payload) {
  try {
    return await request(`/${collection}/${payload.id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.log(error);

    return {
      response: { ok: false },
      data: { result: "Fail", reason: error.message },
    };
  }
}

export async function updateRecordById(collection, id, payload) {
  try {
    return await request(`/${collection}/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.log(error);

    return {
      response: { ok: false },
      data: { result: "Fail", reason: error.message },
    };
  }
}

export async function updateMultipartRecordById(collection, id, payload) {
  try {
    return await request(`/${collection}/${id}`, {
      method: "PUT",
      body: payload,
      isMultipart: true,
    });
  } catch (error) {
    console.log(error);

    return {
      response: { ok: false },
      data: { result: "Fail", reason: error.message },
    };
  }
}

export async function updateRecordPath(path, payload) {
  try {
    return await request(`/${path}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.log(error);

    return {
      response: { ok: false },
      data: { result: "Fail", reason: error.message },
    };
  }
}

export async function patchRecord(collection, path, payload) {
  try {
    return await request(`/${collection}/${path}`, {
      method: "PATCH",
      body: payload === undefined ? undefined : JSON.stringify(payload),
    });
  } catch (error) {
    console.log(error);

    return {
      response: { ok: false },
      data: { result: "Fail", reason: error.message },
    };
  }
}

export async function deleteRecordById(collection, id) {
  try {
    return await request(`/${collection}/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.log(error);

    return {
      response: { ok: false },
      data: { result: "Fail", reason: error.message },
    };
  }
}

export async function authRecord(path, payload, method = "POST") {
  try {
    return await request(`/auth/${path}`, {
      method,
      body: payload === undefined ? undefined : JSON.stringify(payload),
      skipRefresh: true,
    });
  } catch (error) {
    console.log(error);

    return {
      response: { ok: false },
      data: { result: "Fail", reason: error.message },
    };
  }
}


export async function getPublicRecord(collection, query = "") {
  try {
    const backendUrl = getBackendUrl();
    if (!backendUrl) {
      throw new Error("NEXT_PUBLIC_BACKEND_SERVER is not configured.");
    }
    const response = await fetch(`${backendUrl}/${collection}${query ? `?${query}` : ""}`, {
      method: "GET",
      credentials: "omit",
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    return parseResponse(response);
  } catch (error) {
    return {
      response: { ok: false, status: 0 },
      data: { result: "Fail", message: error?.message || "Unable to connect to the API." },
    };
  }
}
