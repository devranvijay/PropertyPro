import { Request, Response, NextFunction } from 'express';

export const authorizeRole = (...roles: string[]) => {
    return (req: any, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized, no user' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};
