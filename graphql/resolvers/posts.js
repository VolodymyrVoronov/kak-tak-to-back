import { AuthenticationError, UserInputError } from "apollo-server";

import Post from "./../../models/Post.js";
import { checkAuth } from "../../utils/checkAuth.js";

export const postResolvers = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);

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
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save();

      context.pubsub.publish("NEW_POST", {
        newPost: post,
      });

      return post;
    },
    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);

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
    async likePost(_, { postId }, context) {
      const { userLogin } = checkAuth(context);

      const post = await Post.findById(postId);

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
