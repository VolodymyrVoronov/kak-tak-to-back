import { gql } from "apollo-server";

export const typeDefs = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    userLogin: String!
    # comments: [Comment]!
    # likes: [Like]!
    likeCount: Int!
    commentCount: Int!
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
  }
  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
  }
`;
