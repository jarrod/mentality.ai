import { Roles } from "@/types/globals"
import { auth } from "@clerk/tanstack-react-start/server"

/** Role from session; defaults to 'user' when not present (e.g. no admin metadata). */
export const getEffectiveRole = async (): Promise<Roles> => {
  const { sessionClaims } = await auth()
  return sessionClaims?.metadata.role ?? "user"
}

export const checkRole = async (role: Roles) => {
  const effective = await getEffectiveRole()
  return effective === role
}