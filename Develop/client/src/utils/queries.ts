// client/src/graphql/queries.ts

import { gql } from '@apollo/client';

// Query to get the current logged-in user
export const GET_ME = gql`
  query Me {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;
