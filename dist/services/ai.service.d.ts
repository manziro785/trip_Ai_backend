import { RouteGenerationParams } from "../types";
export declare class AIService {
    private openai;
    constructor();
    generateRoute(params: RouteGenerationParams, userId?: string): Promise<any>;
    chat(message: string, context?: any): Promise<string>;
    adaptRoute(routeId: string, condition: string, _userId: string): Promise<any>;
    getRecommendations(userId: string): Promise<any>;
    private createRoutePrompt;
}
//# sourceMappingURL=ai.service.d.ts.map