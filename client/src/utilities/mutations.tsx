import { gql } from '@apollo/client';

export const LOGIN = gql`
    mutation Login($username: String!, $password: String!) 
    {
        Login(username: $username, password: $password) 
        {
            token
            user {_id}
        }
    }
`;

export const ADD_USER = gql`
    mutation AddUser ($username: String! $email: String! $password: String!) 
    {
        AddUser (username: $username email: $email password: $password) 
        {
            token
            user 
            {
                _id
                username
                email
            }
        }
    }
`;

export const UPDATE_USER = gql`
    mutation UpdateUser ($email: String! $wins: Int $loses: Int $draws: Int) 
    {
        UpdateUser (email: $email password: $password wins: $wins loses: $loses draws: $draws) 
        {
            user
            {
                _id
                username
                email
                wins
                loses
                draws
            }
        }
    }
`;