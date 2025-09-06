import reservationsList from "../assets/data.json";
import Reservation from "../types/reservation";

export default async function fetchReservationsByDate(date: Date): Promise<Reservation[]> {
  // ⚠️ Aqui você pode substituir por uma chamada real de API (fetch/axios).
  // Por enquanto simulo alguns dados:

  return reservationsList;
}
