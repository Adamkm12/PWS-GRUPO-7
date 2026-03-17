let cachedData = null;

export async function fetchAppData() {
    if (cachedData) return cachedData;
    try {
        const response = await fetch("../assets/json/content.json");
        if (!response.ok) throw new Error("Error loading content.json");
        cachedData = await response.json();
        return cachedData;
    } catch (error) {
        console.error("Failed to fetch app data:", error);
        return { services: [], bookings: [] };
    }
}
