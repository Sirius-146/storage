import Reservation from "../types/reservation";

export type Section = {
  title: string;
  data: Reservation[];
};

/**
 * Constrói seções a partir de subgrupos de refeição.
 */
export function buildMealSections(
  grouped: Record<string, Reservation[]>
): Section[] {
  return Object.entries(grouped).map(([meal, list]) => ({
    title: `${meal} — ${list.length} apts | ${list.reduce((sum, r) => sum + r.guests, 0)} hóspedes`,
    data: list,
  }));
}

/**
 * Constrói uma única seção simples (sem subgrupos).
 */
export function buildSimpleSection(
  label: string,
  list: Reservation[]
): Section[] {
  return [
    {
      title: `${label} — ${list.length} apts | ${list.reduce((sum, r) => sum + r.guests, 0)} hóspedes`,
      data: list,
    },
  ];
}
