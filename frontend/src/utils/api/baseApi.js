// Base API configuration for HTTP requests
const API_BASE_URL = "https://localhost:7213/api";

class BaseApi {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    // Get JWT token from auth service or localStorage
    getAuthToken() {
        // Try to get token from AuthService first
        const currentUser = JSON.parse(localStorage.getItem("user") || "null");

        // For now, return a mock token since we don't have real authentication yet
        // When real authentication is implemented, replace this with actual token
        if (currentUser && currentUser.token) {
            return currentUser.token;
        }

        // Mock token for testing - remove this when real auth is implemented
        return "mock-jwt-token-for-testing";
    }

    // Get common headers with authentication
    getHeaders(includeAuth = true) {
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
        };

        if (includeAuth) {
            const token = this.getAuthToken();
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }
        }

        return headers;
    }

    // Generic GET request
    async get(endpoint, params = {}, includeAuth = true) {
        const url = new URL(`${this.baseURL}${endpoint}`, window.location.origin);

        // Add query parameters
        Object.keys(params).forEach((key) => {
            if (
                params[key] !== undefined &&
                params[key] !== null &&
                params[key] !== ""
            ) {
                url.searchParams.append(key, params[key]);
            }
        });

        const response = await fetch(url.toString(), {
            method: "GET",
            headers: this.getHeaders(includeAuth),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    // Generic POST request
    async post(endpoint, data = null, includeAuth = true) {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: "POST",
            headers: this.getHeaders(includeAuth),
            body: data ? JSON.stringify(data) : null,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    // Generic PUT request
    async put(endpoint, data = null, includeAuth = true) {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: "PUT",
            headers: this.getHeaders(includeAuth),
            body: data ? JSON.stringify(data) : null,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    // Generic DELETE request
    async delete(endpoint, includeAuth = true) {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: "DELETE",
            headers: this.getHeaders(includeAuth),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    // Handle API errors consistently
    handleError(error) {
        console.error("API Error:", error);

        if (error.message.includes("401")) {
            // Token expired or invalid - redirect to login
            localStorage.removeItem("user");
            window.location.href = "/login";
            return { success: false, error: "Phiên đăng nhập đã hết hạn" };
        }

        return {
            success: false,
            error: error.message || "Có lỗi xảy ra khi gọi API",
        };
    }
}

// Create singleton instance
const baseApi = new BaseApi();
export default baseApi;
