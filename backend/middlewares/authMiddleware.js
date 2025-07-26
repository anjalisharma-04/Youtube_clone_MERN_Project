//backend/middlewares/authMiddleware.js
import { ApiError } from "../utils/ApiError.js"; 
import { asyncHandler } from "../utils/asyncHandler.js"; 
import jwt from "jsonwebtoken"; 
import { newUser } from "../models/userModel.js"; 

// Middleware to verify JWT and authenticate the user
export const verifyJWT = asyncHandler(async(req , _ , next) => {
   try {
    // Extract token from cookies or Authorization header
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    // If no token is found, throw an Unauthorized error
    if (!token) { 
      throw new ApiError(401 , "Unauthorized request");
    }

    // Verify the token using the secret stored in environment variables
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    // Fetch user details from DB using the ID stored in the token's payload
    const user = await newUser.findById(decodedToken?._id).select("-password");
    
    // If the user is not found or the token is invalid, throw an error
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    // Add the user to the request object for later use
    req.user = user;
    
    // Call the next middleware in the stack
    next();
  } catch (error) {
    // If any error occurs, throw an Unauthorized error with a message
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
