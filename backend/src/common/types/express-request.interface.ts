import { Request } from 'express'

export interface AuthenticatedRequest extends Request {
    user: {
        userId: number
    }
}

export interface MaybeAuthenticatedRequest extends Request {
    user?: {
        userId: number
    }
}
