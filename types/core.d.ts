import * as express from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: {
                uid: string; // or other properties you want to include
                role?: string; // include role if you are storing it
            };
        }
    }
}

declare module 'cors';