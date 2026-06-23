import { UserRole } from "@prisma/client";

export type { UserRole };

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  image: string | null;
  institution: string | null;
}
