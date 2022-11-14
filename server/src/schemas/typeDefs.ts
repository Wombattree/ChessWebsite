import { gql } from 'apollo-server-express';

export const typeDefs = gql`
	type User 
	{
		_id: ID
		userName: String
		email: String
		wins: Number
		loses: Number
		draws: Number
	}

	type Authentication
	{
		token: ID
		user: User
	}

	type Query 
	{
		GetUser: User
	}

	type Mutation 
	{
		AddUser(userName: String!, email: String!, password: String!): Authentication
		UpdateUser(userName: String!, email: String!, password: String!, wins: Number, loses: Number, draws: Number): User
		Login(email: String!, password: String!): Authentication
	}
`;