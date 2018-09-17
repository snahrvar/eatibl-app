export class Booking {
  constructor(
    public restaurant_fid: any,
    public user_fid: any,
    public date: Date,
    public time: number,
    public discount: number,
    public people: number,
    public name: string,
    public email: string,
    public redeemed: any,
    public disabled: number,
    public created_at?: Date,
    public updated_at?: Date) {
  }
}
