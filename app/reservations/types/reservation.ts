export default interface Reservation {
  id: number;
  plannedCheckin: string;
  checkin: string | null;
  plannedCheckout: string;
  checkout: string | null;
  status: string;
  apartment: {
    id: number;
    number: number;
    type: string;
  };
  client: {
    id: number;
    name: string;
    cpf: string;
    phone: string;
    email: string;
    address: string;
  };
  guests: number;
}
