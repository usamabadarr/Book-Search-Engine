import User from './models/User'; // Assume you have a User model for MongoDB or Mongoose
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const resolvers = {
  Query: {
    // Fetch the currently authenticated user
    me: async (_, __, { user }) => {
      if (!user) {
        throw new Error('Not authenticated');
      }
      return await User.findById(user._id); // Find user by ID
    }
  },

  Mutation: {
    // Log in and return an Auth token and user
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new Error('Invalid credentials');
      }

      // Generate a JWT token
      const token = jwt.sign(
        { _id: user._id, username: user.username, email: user.email },
        process.env.JWT_SECRET_KEY!,
        { expiresIn: '1h' }
      );

      return {
        token,
        user
      };
    },

    // Create a new user and return an Auth token and user
    addUser: async (_, { username, email, password }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ username, email, password: hashedPassword });
      await user.save();

      // Generate a JWT token
      const token = jwt.sign(
        { _id: user._id, username: user.username, email: user.email },
        process.env.JWT_SECRET_KEY!,
        { expiresIn: '1h' }
      );

      return {
        token,
        user
      };
    },

    // Save a book for the authenticated user
    saveBook: async (_, { bookData }, { user }) => {
      if (!user) {
        throw new Error('Not authenticated');
      }

      // Find the user and add the book to savedBooks
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
          $addToSet: { savedBooks: bookData }, // Add book to savedBooks array if not already present
        },
        { new: true } // Return the updated user
      );

      return updatedUser;
    },

    // Remove a book for the authenticated user
    removeBook: async (_, { bookId }, { user }) => {
      if (!user) {
        throw new Error('Not authenticated');
      }

      // Find the user and remove the book from savedBooks
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
          $pull: { savedBooks: { bookId } }, // Remove book from savedBooks array
        },
        { new: true } // Return the updated user
      );

      return updatedUser;
    }
  }
};

export default resolvers;
