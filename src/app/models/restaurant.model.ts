export class Restaurant {
  constructor(
    public name: string,
    public vicinity: string,
    public bookings: number[],
    public bookingCount: number, //this is just bookings.length
    public bookingAttempt: number,
    public customers: number,
    public mapVisit: number,
    public cardVisit: number,
    public markerClick: number,
    public created_at?: Date,
    public updatedAt?: Date) {

  }
}
