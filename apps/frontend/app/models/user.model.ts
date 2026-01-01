export interface User {
    id: number;
    name: string;
    email: string;
    role: "ADMIN" | "USER";
    created_at: string;
    updated_at: string;
}
