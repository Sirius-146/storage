import Reservation from "../types/reservation";

/**
 * Determina a refeição com base na hora.
 */
function getMealFromTime(dateTime: string): string {
  const hour = new Date(dateTime).getHours();
  if (hour < 12) return "Café da manhã";
  if (hour < 14) return "Almoço";
  return "Jantar";
}

/**
 * Agrupa chegadas por refeição, considerando plannedCheckin e checkin real.
 */
export function groupArrivalByMeal(reservations: Reservation[]) {
  const groups: Record<string, Reservation[]> = {
    "Café da manhã": [],
    "Almoço": [],
    "Jantar": [],
  };

  reservations.forEach((r) => {
    const actual = r.checkin ?? r.plannedCheckin; // usar checkin real se existir
    if (!actual) return;
    const meal = getMealFromTime(actual);
    groups[meal].push(r);
  });

  return groups;
}

/**
 * Agrupa saídas por refeição, considerando plannedCheckout e checkout real.
 */
export function groupDepartureByMeal(reservations: Reservation[]) {
  const groups: Record<string, Reservation[]> = {
    "Café da manhã": [],
    "Almoço": [],
    "Jantar": [],
  };

  reservations.forEach((r) => {
    const actual = r.checkout ?? r.plannedCheckout; // usar checkout real se existir
    if (!actual) return;
    const meal = getMealFromTime(actual);
    groups[meal].push(r);
  });

  return groups;
}

// Horários fixos das refeições
const mealTimes = {
  breakfast: "10:00",
  lunch: "12:00",
  dinner: "14:00",
};

export function calculateMealTotals(arriving: Reservation[], leaving: Reservation[], active: Reservation[]) {
  // Inicial: café da manhã = apenas ativos
  const totals: Record<string, { apartments: number; guests: number }> = {
    breakfast: {
      apartments: active.length,
      guests: active.reduce((sum, r) => sum + r.guests, 0),
    },
    lunch: { apartments: 0, guests: 0 },
    dinner: { apartments: 0, guests: 0 },
  };

  // --- Almoço ---
  const lunchArrivals = arriving.filter(r => r.plannedCheckin.slice(11,16) === mealTimes.lunch);
  const lunchDepartures = leaving.filter(r => r.plannedCheckout.slice(11,16) <= mealTimes.lunch);

  totals.lunch.apartments = totals.breakfast.apartments + lunchArrivals.length - lunchDepartures.length;
  totals.lunch.guests =
    totals.breakfast.guests +
    lunchArrivals.reduce((sum, r) => sum + r.guests, 0) -
    lunchDepartures.reduce((sum, r) => sum + r.guests, 0);

  return totals;
}