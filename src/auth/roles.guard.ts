import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLES_KEY } from "./roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
        if (!roles) {
            return true; // If no roles are defined, allow access
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user; // Assuming user is attached to the request
        console.log('User from token:', user);
        return user && roles.includes(user.role); // Check if user's role is in the allowed roles
    }
}