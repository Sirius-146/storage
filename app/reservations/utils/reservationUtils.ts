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

function getLeaveMeal(dateTime: string): string {
  const hour = new Date(dateTime).getHours();
  if (hour < 12) return "Café da manhã";
  if (hour > 19) return "Jantar" ;
  return "Almoço";
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
    const meal = getLeaveMeal(actual);
    groups[meal].push(r);
  });

  return groups;
}

type MealTotals = {
  apartments: number;
  guests: number;
};

export function calculateMealTotals(
  arriving: Reservation[],
  leaving: Reservation[],
  active: Reservation[]
): { breakfast: MealTotals; lunch: MealTotals; dinner: MealTotals } {
  // Agrupar chegadas e saídas já usando suas funções
  const arrivals = groupArrivalByMeal(arriving);
  const departures = groupDepartureByMeal(leaving);

  // Para evitar duplicação de reservas, usamos Map por ID
  function sum(reservations: Reservation[]): MealTotals {
    const apartments = new Set<number>();
    let guests = 0;
    reservations.forEach((r) => {
      apartments.add(r.apartment.id);
      guests += r.guests ?? 0;
    });
    return { apartments: apartments.size, guests };
  }

  // Café da manhã = ativos + saídas após café
  const breakfast = sum([
    ...active,
    ...departures["Café da manhã"],
    ...departures["Almoço"],
    ...departures["Jantar"],
  ]);

  // Almoço = ativos + chegadas almoço + saídas após almoço
  const lunch = sum([
    ...active,
    ...arrivals["Almoço"],
    ...departures["Almoço"],
  ]);

  // Jantar = ativos + chegadas almoço + chegadas jantar
  const dinner = sum([
    ...active,
    ...arrivals["Almoço"],
    ...arrivals["Jantar"],
  ]);

  return { breakfast, lunch, dinner };
}
