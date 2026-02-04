// Domain Entity: User
// Pure business logic, framework-independent

export interface User {
    id: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export interface UserSession {
    user: User;
    access_token: string;
    refresh_token: string;
    expires_at: number;
}
