import { AuthenticationError, UserInputError } from "apollo-server";

import Post from "./../../models/Post.js";
import { checkAuth } from "../../utils/checkAuth.js";

export const commentResolvers = {
  Mutation: {
    async writeComment(_, { id, commentText }, context) {
      const { userLogin } = checkAuth(context);

      if (commentText.trim() === "") {
        throw new UserInputError("Пустой комментарий", {
          errors: {
            body: "Комментарий не должен быть пустым.",
          },
        });
      }

      const post = await Post.findById(id);

      if (post) {
        post.comments.unshift({
          commentText,
          userLogin,
          createdAt: new Date(),
        });

        await post.save();

        return post;
      } else throw new AuthenticationError("Сообщение не найдено.");
    },

    async deleteComment(_, { postId, id }, context) {
      const { userLogin } = checkAuth(context);

      const post = await Post.findById(postId);

      if (post) {
        const commentIndex = post.comments.findIndex((c) => c.id === id);

        if (post.comments[commentIndex].userLogin === userLogin) {
          post.comments.splice(commentIndex, 1);
          await post.save();
          return post;
        } else throw new AuthenticationError("Удаление запрещено.");
      } else throw new UserInputError("Сообщение не найдено.");
    },
  },
};
