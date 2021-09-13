import { AuthenticationError, UserInputError } from "apollo-server";

import Post from "./../../models/Post.js";
import { checkAuth } from "../../utils/checkAuth.js";

export const postResolvers = {
  Query: {
    async getPosts() {
      try {
        const posts = await (await Post.find().sort({ createAt: -1 })).reverse();

        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },
    async getPost(_, { id }) {
      try {
        const post = await Post.findById(id);

        if (post) {
          return post;
        } else {
          throw new Error("Сообщение не найдено.");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    async createPost(_, { postText }, context) {
      const user = checkAuth(context);

      if (postText.trim() === "") {
        throw new Error("Сообщение не должно быть пустым.");
      }

      const newPost = new Post({
        postText,
        user: user.id,
        userLogin: user.userLogin,
        createdAt: new Date(),
      });

      const post = await newPost.save();

      context.pubsub.publish("NEW_POST", {
        newPost: post,
      });

      return post;
    },
    async deletePost(_, { id }, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(id);

        if (user.userLogin === post.userLogin) {
          await post.delete();

          return "Сообщение успешно удалено.";
        } else {
          throw new AuthenticationError("Удаление запрещено.");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    async likePost(_, { id }, context) {
      const { userLogin } = checkAuth(context);

      const post = await Post.findById(id);

      if (post) {
        if (post.likes.find((like) => like.userLogin === userLogin)) {
          post.likes === post.likes.filter((like) => like.userLogin !== userLogin);
        } else {
          post.likes.push({
            userLogin,
            createdAt: new Date().toISOString(),
          });
        }

        await post.save();
        return post;
      } else {
        throw new UserInputError("Сообщение не найдено.");
      }
    },
  },
  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("NEW_POST"),
    },
  },
};
