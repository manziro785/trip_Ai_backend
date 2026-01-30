interface JwtPayload {
    id: string;
    email: string;
    name?: string;
}
export declare const generateToken: (payload: JwtPayload) => string;
export declare const verifyToken: (token: string) => JwtPayload;
export declare const decodeToken: (token: string) => JwtPayload | null;
export {};
//# sourceMappingURL=jwt.d.ts.map