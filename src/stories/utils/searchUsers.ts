import { User } from "../types/TeamMember";
import { getUsers } from "./getTeamMembers";

const savedUsers = getUsers(500);
export const searchUsers = (search: string): PromiseLike<User[]> => {
  return new Promise((res) => {
    setTimeout(() => {
      res(savedUsers.filter((user) => user.fullName.toLowerCase().includes(search.toLowerCase())))
    }, 1000)
  })
}
