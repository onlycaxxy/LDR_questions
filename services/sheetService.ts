// src/services/sheetService.ts

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxakjKYeaVgUeGP45v9a7QSXrl_M_3AAf02UNpbNzqjJxDfRvjtlEyC0IfpipLZP-VT/exec";

export const fetchQuestionsFromSheet = async (roll: number) => {
  try {
    // FIX: No headers, no mode, no credentials. Just the URL.
    // This prevents the "Preflight" check that causes the CORS error.
    const response = await fetch(`${APPS_SCRIPT_URL}?roll=${roll}`);

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching from Google Sheet:", error);
    return {
        category: "Error Mode",
        for_partner_a: "Could not reach the sheet. Play truth or dare instead?",
        for_partner_b: "Could not reach the sheet. Play truth or dare instead?"
    };
  }
};