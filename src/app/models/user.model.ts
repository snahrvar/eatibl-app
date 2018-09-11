export class User {
    constructor(
        public name: string,
        public email: string,
        public type: string,
        public created_at: Date,
        public phone?: string,
        public updatedAt?: Date) {
    }
}