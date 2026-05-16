const baseUrl = import.meta.env.VITE_API_BASE_URL;

if (!baseUrl) {
    throw new Error("Missing VITE_API_BASE_URL");
}

export const API_BASE_URL = baseUrl;