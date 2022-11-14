import { AuthenticationError } from 'apollo-server-express';
import { User } from '../models';
import Authentication from '../utils/Authentication';

export const resolvers = 
{
	Query:
	{
		GetUser: async (parent: any, args: any, context: any) => 
		{
			if (context.user) 
			{
				const user = await User.findById(context.user._id);
				return user;
			}

			throw new AuthenticationError('Not logged in');
		},
	},
	Mutation: 
	{
		AddUser: async (parent: any, args: any) => 
		{
			const user = await User.create(args);
			const token = Authentication.SignToken(user);

			return { token, user };
		},
		UpdateUser: async (parent: any, args: any, context: any) => 
		{
			if (context.user) {
				return await User.findByIdAndUpdate(context.user._id, args, { new: true });
			}

			throw new AuthenticationError('Not logged in');
		},
		Login: async (parent: any, args: any) => 
		{
			const user = await User.findOne({ userName: args.email });

			if (!user) throw new AuthenticationError('Incorrect credentials');

			const correctPassword = await user.IsCorrectPassword(args.password);

			if (correctPassword === false) {
				throw new AuthenticationError('Incorrect credentials');
			}

			const token = Authentication.SignToken(user);

			return { token, user };
		}
	}
};