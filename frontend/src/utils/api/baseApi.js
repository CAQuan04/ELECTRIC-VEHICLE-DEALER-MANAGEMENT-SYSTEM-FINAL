// Base API configuration for HTTP requests
const API_BASE_URL = "https://localhost:7213/api";

class BaseApi {
    constructor() {
        this.baseURL = API_BASE_URL;
        // bật/tắt console log (false khi production)
        this.debug = true;
    }

    // Get JWT token from auth service or localStorage
    getAuthToken() {
        const currentUser = JSON.parse(localStorage.getItem("user") || "null");

        if (currentUser && currentUser.token) {
            return currentUser.token;
        }

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

    // Mask sensitive header values for logging
    maskHeaders(headers = {}) {
        const masked = { ...headers };
        if (masked.Authorization) {
            const parts = masked.Authorization.split(" ");
            const prefix = parts[0] || "Bearer";
            // chỉ giữ 4 ký tự cuối nếu dài, còn lại replace bằng ***
            const token = parts[1] || "";
            const visible = token.length > 8 ? `***${token.slice(-8)}` : "***";
            masked.Authorization = `${prefix} ${visible}`;
        }
        return masked;
    }

    // Helper to parse response body safely
    async parseResponseBody(response) {
        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch {
            return text;
        }
    }

    // Centralized request logger
    logRequest({ method, endpoint, url, params, body, headers, duration, status, responseBody }) {
        if (!this.debug) return;
        const basic = `[API] ${method.toUpperCase()} ${endpoint} => ${url}`;
        console.groupCollapsed ? console.groupCollapsed(basic) : console.log(basic);
        try {
            if (params && Object.keys(params).length) {
                console.log("Params:", params);
            }
            if (body !== undefined && body !== null) {
                console.log("Body:", body);
            }
            console.log("Headers:", this.maskHeaders(headers));
            if (status !== undefined) {
                console.log("Status:", status);
            }
            if (duration !== undefined) {
                console.log("Duration (ms):", duration.toFixed(2));
            }
            if (responseBody !== undefined) {
                console.log("Response:", responseBody);
            }
        } finally {
            console.groupEnd ? console.groupEnd() : null;
        }
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

        const headers = this.getHeaders(includeAuth);
        const start = performance.now();

        try {
            const response = await fetch(url.toString(), {
                method: "GET",
                headers,
            });

            const duration = performance.now() - start;
            const parsed = await this.parseResponseBody(response);

            this.logRequest({
                method: "GET",
                endpoint,
                url: url.toString(),
                params,
                headers,
                duration,
                status: response.status,
                responseBody: parsed,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return parsed;
        } catch (error) {
            this.logRequest({
                method: "GET",
                endpoint,
                url: url.toString(),
                params,
                headers,
                duration: performance.now() - start,
                responseBody: error.message,
            });
            throw this.handleError(error);
        }
    }

    // Generic POST request
    async post(endpoint, data = null, includeAuth = true) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = this.getHeaders(includeAuth);
        const start = performance.now();
        const body = data ? JSON.stringify(data) : null;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers,
                body,
            });

            const duration = performance.now() - start;
            const parsed = await this.parseResponseBody(response);

            this.logRequest({
                method: "POST",
                endpoint,
                url,
                body: data,
                headers,
                duration,
                status: response.status,
                responseBody: parsed,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return parsed;
        } catch (error) {
            this.logRequest({
                method: "POST",
                endpoint,
                url,
                body: data,
                headers,
                duration: performance.now() - start,
                responseBody: error.message,
            });
            throw this.handleError(error);
        }
    }

    // Generic PUT request
    async put(endpoint, data = null, includeAuth = true) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = this.getHeaders(includeAuth);
        const start = performance.now();
        const body = data ? JSON.stringify(data) : null;

        try {
            const response = await fetch(url, {
                method: "PUT",
                headers,
                body,
            });

            const duration = performance.now() - start;
            const parsed = await this.parseResponseBody(response);

            this.logRequest({
                method: "PUT",
                endpoint,
                url,
                body: data,
                headers,
                duration,
                status: response.status,
                responseBody: parsed,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return parsed;
        } catch (error) {
            this.logRequest({
                method: "PUT",
                endpoint,
                url,
                body: data,
                headers,
                duration: performance.now() - start,
                responseBody: error.message,
            });
            throw this.handleError(error);
        }
    }

    // Generic DELETE request
    async delete(endpoint, includeAuth = true) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = this.getHeaders(includeAuth);
        const start = performance.now();

        try {
            const response = await fetch(url, {
                method: "DELETE",
                headers,
            });

            const duration = performance.now() - start;
            const parsed = await this.parseResponseBody(response);

            this.logRequest({
                method: "DELETE",
                endpoint,
                url,
                headers,
                duration,
                status: response.status,
                responseBody: parsed,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return parsed;
        } catch (error) {
            this.logRequest({
                method: "DELETE",
                endpoint,
                url,
                headers,
                duration: performance.now() - start,
                responseBody: error.message,
            });
            throw this.handleError(error);
        }
    }

    // Handle API errors consistently
    handleError(error) {
        console.error("API Error:", error);

        try {
            if (error.message && error.message.includes("401")) {
                // Token expired or invalid - redirect to login
                localStorage.removeItem("user");
                window.location.href = "/login";
                return { success: false, error: "Phiên đăng nhập đã hết hạn" };
            }
        } catch (e) {
            // ignore any error thrown during error handling
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
