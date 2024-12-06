import User from "../models/User.js"
import { signToken } from '../services/auth.js'



const resolvers = {
    Query: {
        me: async (_parent: any, _arg: any, context: any) => {
            if (context.user) {
                return await User.findOne({_id: context.user._id})
            }
            throw new Error("Could not find user")
        }
    },
    Mutation: {
        addUser: async (_parent: any, {username, email, password}: any) => {
            const user = await User.create({username, email, password})
            if (!user) {
                throw new Error('User creation failed');
              }
              const token = signToken(user.username, user.email, user._id);
              return { token, user }
        },
        login:  async (_parent: any, {email, password}: any) => {
            const user = await User.findOne({email})
            if (!user) {
                throw new Error('Authentication failed');
              }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new Error ('Authentication failed');
            }
            const token = signToken(user.username, user.email, user._id);
            return { token, user }
        },
        saveBook: async (_parent: any, arg: any, context: any) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: arg.book } },
                { new: true, runValidators: true }
              )
            if (!updatedUser) {
                throw new Error("Couldn't find user with this id!")
            }
            return updatedUser
        },
        deleteBook: async (_parent: any, arg: any, context: any) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId: arg.bookId } } },
                { new: true }
              );
              if (!updatedUser) {
                throw new Error("Couldn't find user with this id!");
              }
              return updatedUser
        }

    }
}



export default resolvers
