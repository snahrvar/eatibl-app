export class UserLog {
    constructor(
        public event: string,
        public page: string,
        public deviceId: string,
        public notes: string,
        public created_at?: Date,
        public updated_at?: Date) {
    }
}
