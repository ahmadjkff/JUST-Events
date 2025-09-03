import { Roles } from "../types/Roles";

export const users = {
  "ajalfakori22@cit.just.edu.jo": {
    password: "mypassword123",
    firstName: "Ahmad",
    lastName: "Alfakori",
    faculty: "Engineering",
    email: "ajalfakori22@cit.just.edu.jo",
    role: Roles.ADMIN,
  },
  "omalsaleh22@cit.just.edu.jo": {
    password: "123456",
    firstName: "Omar",
    lastName: "AlSaleh",
    faculty: "IT",
    email: "omalsaleh22@cit.just.edu.jo",
    role: Roles.ADMIN,
  },
  "anas22@cit.just.edu.jo": {
    password: "123456",
    firstName: "Anas",
    lastName: "Ammorah",
    faculty: "IT",
    email: "anas22@cit.just.edu.jo",
    role: Roles.SUPERVISOR,
  },
};
