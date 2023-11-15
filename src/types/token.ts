import { TokenType } from "@prisma/client"

export interface Token {
    id?: number
    token: string
    tokenType: TokenType
    expirationTime: Date
    userId: number
}