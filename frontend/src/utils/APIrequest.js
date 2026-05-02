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
    const detail = errorData.detail;
    let message;
    if (Array.isArray(detail)) {
      message = detail.map(d => d.msg || JSON.stringify(d)).join("; ");
    } else {
      message = detail || `Request failed with status ${response.status}`;
    }
    throw new Error(message);
  }

  return response.json();
}
