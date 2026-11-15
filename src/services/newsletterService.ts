const API_URL = "http://localhost:5000/api";

export async function subscribeToNewsletter(email: string): Promise<string> {
    const response = await fetch(`${API_URL}/newsletter/subscribe`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Subscription failed.");
    }

    return data.message;
}