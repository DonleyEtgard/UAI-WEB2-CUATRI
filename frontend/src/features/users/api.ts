import API from "../../services/api";

export interface User {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  role: string;
  plan?: string;
  isActive: boolean;
  createdAt?: string;
}

export const getUsers = async (): Promise<User[]> => {
  const res = await API.get("/users");
  // Match the response structure observed in UserPage.tsx
  return Array.isArray(res.data?.data?.users) ? res.data.data.users : [];
};

export const toggleUserStatus = async (id: string, isActive: boolean): Promise<void> => {
  // Uses the PATCH method to invert the isActive status
  await API.patch(`/users/${id}`, { isActive: !isActive });
};