import { useEffect, useMemo, useState } from "react";
import fetchReservationsByDate from "../services/reservationService";
import Reservation from "../types/reservation";
import toLocaldate from "../utils/dateUtils";

export default function useReservations(date: Date) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchReservationsByDate(date)
      .then((data) => setReservations(data))
      .finally(() => setLoading(false));
  }, [date]);

  const todayStr = toLocaldate(date);

  const { arriving, leaving, active } = useMemo(() => {
    const arrivingArr: Reservation[] = [];
    const leavingArr: Reservation[] = [];
    const activeArr: Reservation[] = [];

    reservations.forEach((r) => {
      const checkin = (r.checkin ?? r.plannedCheckin )?.slice(0, 10);
      const checkout = (r.checkout ?? r.plannedCheckout )?.slice(0, 10);

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
