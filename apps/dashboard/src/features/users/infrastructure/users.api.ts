import axios from "axios";
import type { User } from "../domain/User";

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    // Calling external public API
    const response = await axios.get<User[]>("https://jsonplaceholder.typicode.com/users");
    return response.data;
  },
};
