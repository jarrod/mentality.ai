export {}

// Create a type for the Roles
export type Roles = 'user' | 'admin'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}