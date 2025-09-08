export interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: Roles;
  faculty: string;
}

export enum Roles {
  STUDENT = "student",
  SUPERVISOR = "supervisor",
  ADMIN = "admin",
}
