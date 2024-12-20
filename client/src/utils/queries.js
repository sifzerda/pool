import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  query getUser($userId: ID!) {
    user(userId: $userId) {
      _id
      username
      email
    }
  }
`;

export const QUERY_USERS = gql`
  {
    users {
      _id
      username
      email
      poolScore {
        poolPoints
        poolTimeTaken
      }
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
            poolScore {
        poolPoints
        poolTimeTaken
      }
    }
  }
`;

export const GET_POOL_SCORE = gql`
  query getPoolScore($userId: ID!) {
    getPoolScore(userId: $userId) {
      poolPoints
      pooltimeTaken
    }
  }
`;


