import { userResolvers } from "./users.js";
import { postResolvers } from "./posts.js";
import { commentResolvers } from "./comments.js";

export const resolvers = {
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentResolvers.Mutation,
  },
  Query: {
    ...postResolvers.Query,
  },
  Subscription: {
    ...postResolvers.Subscription,
  },
};
