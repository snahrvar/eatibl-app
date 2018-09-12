export class Device {
  constructor(
    public deviceId: string,
    public platform: string,
    public model: string,
    public version: string,
    public eatiblVersion: string,
    public created_at?: Date,
    public updated_at?: Date) {
  }
}
