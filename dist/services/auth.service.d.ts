export declare class AuthService {
    register(email: string, password: string, name?: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string | null;
            avatar: string | null;
            createdAt: Date;
        };
        token: string;
    }>;
    login(email: string, password: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string | null;
            avatar: string | null;
        };
        token: string;
    }>;
    googleAuth(googleId: string, email: string, name: string, avatar?: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string | null;
            avatar: string | null;
        };
        token: string;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map