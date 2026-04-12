export async function apiRequest({ url, method = "GET", headers = {}, data = null }) {
  const token = localStorage.getItem("access_token");

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  const config = {
    method,
    headers: defaultHeaders,
  };

  if (data) {
    config.body = typeof data === "string" ? data : JSON.stringify(data);
  }

  const response = await fetch(url, config);

  if (response.status === 401) {
    localStorage.clear();
    window.location.href = "/login";
    return;
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Request failed with status ${response.status}`);
  }

  return response.json();
}
