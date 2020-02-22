import gql from 'graphql-tag';
import UserNotificationFragment from '../fragments/UserNotificationFragment';
import GraphqlService from '../services/GraphqlService';

class UserNotificationAPI {
  constructor(graphqlService) {
    this.graphqlService = graphqlService;
  }

  async getUserNotifications() {
    const { getUsersNotifications: notifications } = await this.graphqlService.query({
      query: gql`
        query GetUsersNotifications {
          getUsersNotifications {
            ...UserNotificationFragment
          }
        }
        ${UserNotificationFragment}
      `,
      fetchPolicy: 'network-only',
    });

    return notifications;
  }

  async readNotifications(notificationsIds) {
    const { readNotifications: result } = await this.graphqlService.mutate({
      variables: {
        notificationsIds,
      },
      mutation: gql`
        mutation ReadNotifications($notificationsIds: [Float!]!) {
          readNotifications(notificationsIds: $notificationsIds)
        }
      `,
    });

    return result;
  }
}

export default new UserNotificationAPI(GraphqlService);
