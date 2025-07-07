import { useUserStore } from "../store/useUserStore";

export const fetchWithAuth = async (url, options = {}) => {
  const token = useUserStore.getState().accessToken;
  const refresh = useUserStore.getState().refreshToken;
  const setAccessToken = useUserStore.getState().setAccessToken;
  const logout = useUserStore.getState().logout;

  // Attach the token
  const authHeaders = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  let res = await fetch(url, { ...options, headers: authHeaders });

  // If unauthorized, try refreshing token
  if (res.status === 401 && refresh) {
    const refreshRes = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/token/refresh/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      }
    );

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      setAccessToken(data.access);

      // Retry original request with new token
      const retryHeaders = {
        ...options.headers,
        Authorization: `Bearer ${data.access}`,
      };
      res = await fetch(url, { ...options, headers: retryHeaders });
    } else {
      logout();
      throw new Error("Session expired. Please log in again.");
    }
  }

  return res;
};
