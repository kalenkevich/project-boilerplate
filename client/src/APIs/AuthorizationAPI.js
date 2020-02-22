import gql from 'graphql-tag';
import UserFragment from '../fragments/UserFragment';
import GraphqlService from '../services/GraphqlService';

class AuthorizationAPI {
  constructor(graphqlService) {
    this.graphqlService = graphqlService;
  }

  async initiateSignUp(phone) {
    const { initiateSignUp: verificationToken } = await this.graphqlService.mutate({
      variables: {
        initiateSignUpData: {
          phone,
        },
      },
      mutation: gql`
        mutation InitiateSignUp($initiateSignUpData: InitiateSignUpInput!) {
          initiateSignUp(initiateSignUpData: $initiateSignUpData)
        }
      `,
    });

    return verificationToken;
  }

  async verifyCode(code, verificationToken) {
    const { verifyCode: signUpToken } = await this.graphqlService.mutate({
      variables: {
        verificationData: {
          code,
          verificationToken,
        },
      },
      mutation: gql`
        mutation VerifyCode($verificationData: VerificationInput!) {
          verifyCode(verificationData: $verificationData)
        }
      `,
    });

    return signUpToken;
  }

  async signUp(signUpData, signUpToken) {
    const { signUp: result } = await this.graphqlService.mutate({
      variables: {
        signUpData: {
          ...signUpData,
          signUpToken,
        },
      },
      mutation: gql`
        mutation SignUp($signUpData: SignUpInput!) {
          signUp(signUpData: $signUpData)
        }
      `,
    });

    return result;
  }

  async authorize() {
    const { authorize: user } = await this.graphqlService.query({
      query: gql`
        query Authorize {
          authorize {
            ...UserFragment
          }
        }
        ${UserFragment}
      `,
      fetchPolicy: 'network-only',
    });

    return user;
  }

  async signIn(phone, password) {
    const { signIn: user } = await this.graphqlService.mutate({
      variables: {
        signInData: {
          phone,
          password,
        },
      },
      mutation: gql`
        mutation SignIn($signInData: UserSignInInput!) {
          signIn(signInData: $signInData) {
            ...UserFragment
          }
        }
        ${UserFragment}
      `,
    });

    return user;
  }

  async signOut() {
    const { signOut: result } = await this.graphqlService.query({
      query: gql`
        query SignOut {
          signOut
        }
      `,
      fetchPolicy: 'network-only',
    });

    return result;
  }

  async initiateResetPasswordWithPhone(resetPasswordWithPhoneData) {
    const { initiateResetPasswordWithPhone: result } = await this.graphqlService.mutate({
      variables: {
        resetPasswordWithPhoneData,
      },
      mutation: gql`
        mutation InitiateResetPasswordWithPhone($resetPasswordWithPhoneData: InitiateResetPasswordWithPhoneDataInput!) {
          initiateResetPasswordWithPhone(resetPasswordWithPhoneData: $resetPasswordWithPhoneData)
        }
      `,
    });

    return result;
  }

  async verifyResetPasswordCode(verificationData) {
    const { verifyResetPasswordCode: result } = await this.graphqlService.mutate({
      variables: {
        verificationData,
      },
      mutation: gql`
        mutation VerifyResetPasswordCode($verificationData: VerificationInput!) {
          verifyResetPasswordCode(verificationData: $verificationData) {
            resetPasswordToken
            user {
              ...UserFragment
            }
          }
        }
        ${UserFragment}
      `,
    });

    return result;
  }

  async resetPasswordWithPhone(resetPasswordWithPhoneData) {
    const { resetPasswordWithPhone: result } = await this.graphqlService.mutate({
      variables: {
        resetPasswordWithPhoneData,
      },
      mutation: gql`
        mutation ResetPasswordWithPhone($resetPasswordWithPhoneData: ResetPasswordWithPhoneDataInput!) {
          resetPasswordWithPhone(resetPasswordWithPhoneData: $resetPasswordWithPhoneData)
        }
      `,
    });

    return result;
  }

  async updatePassword(oldPassword, newPassword) {
    const { updatePassword: result } = await this.graphqlService.mutate({
      variables: {
        oldPassword,
        newPassword,
      },
      mutation: gql`
        mutation UpdatePassword($oldPassword: String!, $newPassword: String!) {
          updatePassword(oldPassword: $oldPassword, newPassword: $newPassword)
        }
      `,
    });

    return result;
  }
}

export default new AuthorizationAPI(GraphqlService);
