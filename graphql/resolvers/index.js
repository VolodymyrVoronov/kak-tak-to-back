import { userResolvers } from "./users.js";

export const resolvers = {
  Mutation: {
    ...userResolvers,
  },
};
