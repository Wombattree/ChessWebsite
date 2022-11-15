const { gql } = require('apollo-server-express');

const typeDefs = gql`
	type User 
	{
		_id: ID
		username: String
		email: String
		wins: Int
		loses: Int
		draws: Int
	}

	type Authentication
	{
		token: ID
		user: User
	}

	type Query 
	{
		GetUser: User
		GetUsers: [User]
	}

	type Mutation 
	{
		AddUser(username: String!, email: String!, password: String!): Authentication
		UpdateUser(username: String, email: String, password: String, wins: Int, loses: Int, draws: Int): User
		Login(username: String!, password: String!): Authentication
	}
`;

module.exports = typeDefs;