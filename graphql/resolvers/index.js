import { userResolvers } from "./users.js";
import { postResolvers } from "./posts.js";

export const resolvers = {
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
  },
  Query: {
    ...postResolvers.Query,
  },
  Subscription: {
    ...postResolvers.Subscription,
  },
};
