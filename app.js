// import fetch from "node-fetch";
const API_URL = "http://20.244.56.144/evaluation-service/logs";

// Your JWT access token
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJnb3d0aGFtbmFyYXlhbmFzZXR0aUBnbWFpbC5jb20iLCJleHAiOjE3NTU2NzQyNDMsImlhdCI6MTc1NTY3MzM0MywiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjY3NTlhMzM3LWNjYjYtNDhjMC05MTgzLTM3NjkzMTMxNWE5NSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6IiBnb3d0aGFtIG5hcmF5YW5hc2V0dGkiLCJzdWIiOiI2ZmI2ZmEyYS0yZDBjLTRkMjAtYTg1NS1mMjUyZWU2MzkyM2UifSwiZW1haWwiOiJnb3d0aGFtbmFyYXlhbmFzZXR0aUBnbWFpbC5jb20iLCJuYW1lIjoiIGdvd3RoYW0gbmFyYXlhbmFzZXR0aSIsInJvbGxObyI6IjIyYTUxYTA1ZzgiLCJhY2Nlc3NDb2RlIjoiV3FVeFRYIiwiY2xpZW50SUQiOiI2ZmI2ZmEyYS0yZDBjLTRkMjAtYTg1NS1mMjUyZWU2MzkyM2UiLCJjbGllbnRTZWNyZXQiOiJWZ05ITUR4ZE5jQ3BoekRRIn0.hEyWCrnew-wn-rkp0_duOEl02V88ppfNa3YiWlU6Buc";

// Allowed values
const STACKS = ["backend", "frontend"];
const LEVELS = ["debug", "info", "warn", "error", "fatal"];
const BACKEND_PACKAGES = ["cache", "controller", "cron_job", "db", "domain", "handler", "repository", "route", "service"];
const FRONTEND_PACKAGES = ["api", "component", "hook", "page", "state", "style"];
const COMMON_PACKAGES = ["auth", "config", "middleware", "utils"];

function validateInputs(stack, level, pkg) {
    if (!STACKS.includes(stack)) throw new Error(`Invalid stack: ${stack}`);
    if (!LEVELS.includes(level)) throw new Error(`Invalid level: ${level}`);

    let validPackages = [...COMMON_PACKAGES];
    if (stack === "backend") validPackages.push(...BACKEND_PACKAGES);
    if (stack === "frontend") validPackages.push(...FRONTEND_PACKAGES);

    if (!validPackages.includes(pkg)) throw new Error(`Invalid package: ${pkg}`);
}

export async function Log(stack, level, pkg, message) {
    try {
        validateInputs(stack, level, pkg);

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${AUTH_TOKEN}` // ✅ Correct format
            },
            body: JSON.stringify({ stack, level, package: pkg, message })
        });

        const data = await response.json();
        console.log("Log Response:", data);

        return data;
    } catch (error) {
        console.error("Logging Failed:", error.message);
        return { error: error.message };
    }
}

// Example usage
Log("backend", "error", "handler", "received string, expected bool");
Log("backend", "fatal", "db", "Critical database connection failure.");
