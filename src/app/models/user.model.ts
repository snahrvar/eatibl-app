export class User {
    constructor(
        public name: string,
        public email: string,
        public type: string,
        public deviceId: string,
        public created_at?: Date,
        public phone?: string,
        public updated_at?: Date) {
    }
}
