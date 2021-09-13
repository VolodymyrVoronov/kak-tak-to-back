import { gql } from "apollo-server";

export const typeDefs = gql`
  type Post {
    id: ID!
    postText: String!
    createdAt: String!
    userLogin: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }
  type Comment {
    id: ID!
    createdAt: String!
    userLogin: String!
    commentText: String!
  }
  type Like {
    id: ID!
    createdAt: String!
    userLogin: String!
  }
  type User {
    id: ID!
    token: String!
    userLogin: String!
    createdAt: String!
  }
  input RegistrationInput {
    userLogin: String!
    password: String!
    confirmPassword: String!
  }
  type Mutation {
    registration(registrationInput: RegistrationInput): User!
    login(userLogin: String!, password: String!): User!
    createPost(postText: String!): Post!
    deletePost(id: ID!): String!
    createComment(id: String!, commentText: String!): Post!
    deleteComment(id: ID!, commentId: ID!): Post!
    likePost(id: ID!): Post!
  }
  type Query {
    getPosts: [Post]
    getPost(id: ID!): Post
  }
  type Subscription {
    newPost: Post!
  }
`;
