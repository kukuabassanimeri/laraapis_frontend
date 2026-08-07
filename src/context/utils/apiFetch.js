export const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("ACCESS_TOKEN");

  //* Default headers
  const headers = {
    Accept: "application/json",
    ...options.headers,
  };

  //* Attach token
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    //* Check for Session Expiration or Unauthorized Access from Laravel
    if (response.status === 401 || response.status === 419) {
      //* Clear local storage / auth state
      localStorage.removeItem("ACCESS_TOKEN");

      //* Force redirect to login page
      window.location.href = "/login";

      //* Stop further execution
      return null;
    }

    return response;
  } catch (error) {
    console.error("Network / Server error:", error);
    throw error;
  }
};
