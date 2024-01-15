export function loadBasket() {
    try {
      const storedBasket = localStorage.getItem("data");
      return storedBasket ? JSON.parse(storedBasket) : [];
    } catch (error) {
      console.error("Failed to load basket from localStorage:", error);
      return [];
    }
  }