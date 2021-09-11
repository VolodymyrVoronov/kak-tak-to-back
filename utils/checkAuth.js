import { AuthenticationError } from "apollo-server-errors";
import jwt from "jsonwebtoken";

export const checkAuth = (context) => {
  const authHeader = context.req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];

    if (token) {
      try {
        const user = jwt.verify(token, process.env.SECRET_TOKEN);
        return user;
      } catch (error) {
        throw new AuthenticationError("Invalid or expired token");
      }
    }
    throw new Error("Authentication token must be 'Bearer [token]");
  }
  throw new Error("Authorization header must be provided");
};
