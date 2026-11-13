const base = (
  process.env.NEXT_PUBLIC_BACKEND_SERVER || "http://localhost:5000/api"
).replace(/\/+$/, "");

export async function publicApi(
  path,
  { signal, body, method, token, blob, headers = {} } = {},
) {
  const multipart = typeof FormData !== "undefined" && body instanceof FormData;
  const response = await fetch(base + path, {
    signal,
    method: method || (body ? "POST" : "GET"),
    headers: {
      ...headers,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(body && !multipart && { "Content-Type": "application/json" }),
    },
    ...(body && { body: multipart ? body : JSON.stringify(body) }),
  });
  if (blob && response.ok) return response.blob();
  const json = await response.json().catch(() => null);
  if (!response.ok || json?.result !== "Done") {
    const reason = json?.reason;
    throw Object.assign(
      new Error(
        typeof reason === "string"
          ? reason
          : json?.message ||
              "Could not complete the request. Please try again.",
      ),
      {
        status: response.status,
        fields: reason && typeof reason === "object" ? reason : {},
      },
    );
  }
  return json.data ?? { message: json.message };
}

export function hrefWith(path, values) {
  const query = new URLSearchParams(
    Object.entries(values).filter(([, value]) => value !== "" && value != null),
  );
  return query.size ? `${path}?${query}` : path;
}

export const partnerPortal =
  process.env.NEXT_PUBLIC_PARTNER_PORTAL_URL || "https://listing.venuefy.in";

export const eventTypes = {
  wedding: "Wedding",
  engagement: "Engagement",
  reception: "Reception",
  birthday: "Birthday",
  anniversary: "Anniversary",
  corporate: "Corporate event",
  conference: "Conference",
  baby_shower: "Baby shower",
  mehndi: "Mehndi",
  haldi: "Haldi",
  other: "Other",
};

export const money = (value) =>
  value != null && Number.isFinite(+value)
    ? `₹${Number(value).toLocaleString("en-IN")}`
    : "On request";
