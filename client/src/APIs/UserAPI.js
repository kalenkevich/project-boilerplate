import gql from 'graphql-tag';
import UserFragment from '../fragments/UserFragment';
import GraphqlService from '../services/GraphqlService';

class UserAPI {
  constructor(graphqlService) {
    this.graphqlService = graphqlService;
  }

  async getUser(userId) {
    const { getUser: user } = await this.graphqlService.query({
      variables: {
        id: parseInt(userId),
      },
      query: gql`
        query GetUser($id: Float!) {
          getUser(id: $id) {
            ...UserFragment
          }
        }
        ${UserFragment}
      `,
      fetchPolicy: 'network-only',
    });

    return user;
  }
}

export default new UserAPI(GraphqlService);
