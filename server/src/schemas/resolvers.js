const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { SignToken } = require('../utils/auth');

const resolvers = 
{
	Query: 
	{
		GetUser: async (parent, args, context) => 
		{
			if (context.user)
			{
				return await User.findById(context.user._id);
			}

			throw new AuthenticationError('Not logged in');
		},
		GetUsers: async (parent, args, context) => 
		{
			if (context.user)
			{
				return await User.find();
			}

			throw new AuthenticationError('Not logged in');
		},
	},
	Mutation: 
	{
		AddUser: async (parent, args) => 
		{
			const user = await User.create(args);
			const token = SignToken(user);

			return { token, user };
		},

		UpdateUser: async (parent, args, context) => 
		{
			if (context.user) {
				return await User.findByIdAndUpdate(context.user._id, args, { new: true });
			}

			throw new AuthenticationError('Not logged in');
		},

		Login: async (parent, { username, password }) => 
		{
			const user = await User.findOne({ username });
			if (!user) throw new AuthenticationError('Incorrect credentials');

			const correctPassword = await user.IsCorrectPassword(password);
			if (!correctPassword) throw new AuthenticationError('Incorrect credentials');

			const token = SignToken(user);

			return { token, user };
		}
	}
};

module.exports = resolvers;