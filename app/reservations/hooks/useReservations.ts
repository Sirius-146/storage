import { useEffect, useMemo, useState } from "react";
import { fetchReservationsByDate } from "../services/reservationService";
import { Reservation } from "../types/reservation";

export function useReservations(date: Date) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper para formatar a data no formato YYYY-MM-DD
  const formatDate = (d: Date) => {
    const pad = (n: number) => (n < 10 ? `0${n}` : n);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  useEffect(() => {
    setLoading(true);
    fetchReservationsByDate(date)
      .then((data) => setReservations(data))
      .finally(() => setLoading(false));
  }, [date]);

  const todayStr = formatDate(date);

  const { arriving, leaving, active } = useMemo(() => {
    const arrivingArr: Reservation[] = [];
    const leavingArr: Reservation[] = [];
    const activeArr: Reservation[] = [];

    reservations.forEach((r) => {
      const checkin = r.checkin ? r.checkin.slice(0, 10) : r.plannedCheckin;
      const checkout = r.checkout ? r.checkout.slice(0, 10) : r.plannedCheckout;

      if (checkin === todayStr) {
        arrivingArr.push(r);
      } else if (checkout === todayStr) {
        leavingArr.push(r);
      } else if (checkin <= todayStr && todayStr <= checkout) {
        activeArr.push(r);
      }
    });

    return { arriving: arrivingArr, leaving: leavingArr, active: activeArr };
  }, [reservations, todayStr]);

  return { reservations, arriving, leaving, active, loading };
}
