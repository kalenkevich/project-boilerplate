import gql from 'graphql-tag';
import GraphqlService from '../services/GraphqlService';

class UserSettingsAPI {
  constructor(graphqlService) {
    this.graphqlService = graphqlService;
  }

  async updateUserData(userData) {
    const { updateUserData: result } = await this.graphqlService.mutate({
      variables: {
        userData,
      },
      mutation: gql`
        mutation UpdateUserData($userData: UserDataInput!) {
          updateUserData(userData: $userData)
        }
      `,
    });

    return result;
  }
}

export default new UserSettingsAPI(GraphqlService);
