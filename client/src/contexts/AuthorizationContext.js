import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Cookies from 'js-cookies';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { ApolloProvider } from '@apollo/react-hooks';

import AuthorizationService from '../APIs/AuthorizationAPI';
import settings from '../../config/settings';
import {ApolloClient} from 'apollo-client';

const AuthorizationContext = React.createContext({
  user: null,
  signIn: () => {},
  signOut: () => {},
});

const httpLink = new HttpLink({
  uri: settings.BackendUrl
});

const wsClient = new SubscriptionClient(settings.WebsocketUrl, {
  lazy: true,
  reconnect: true,
  connectionParams: () => ({
    authorizationToken: Cookies.getItem('authorizationToken'),
  })
});

const wsLink = new WebSocketLink(wsClient);

const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

export const AuthorizationProvider = AuthorizationContext.Provider;

export const AuthorizationConsumer = AuthorizationContext.Consumer;

const AuthorizationComponent = ({ children, history }) => {
  const [authorizedUser, setAuthorizedUser] = useState(null);
  const [authorizationProcess, setAuthorizationProcessState] = useState(true);

  const authorize = async () => {
    let user = null;
    let error = null;

    try {
      user = await AuthorizationService.authorize();

      const isAdmin = user.role === 'admin' || user.role === 'manager';

      setAuthorizedUser({...user, isAdmin });
    } catch (e) {
      error = e;
    } finally {
      setAuthorizationProcessState(false);
    }

    return [user, error];
  };

  const signIn = async (...args) => {
    let user = null;
    let error = null;

    try {
      user = await AuthorizationService.signIn(...args);

      setAuthorizedUser(user);
      history.push('');
    } catch (e) {
      error = e;
    } finally {
      setAuthorizationProcessState(false);
    }

    return [user, error];
  };

  const signOut = async (...args) => {
    let user = authorizedUser;
    let error = null;

    try {
      await AuthorizationService.signOut(...args);

      setAuthorizedUser(null);
      user = null;
      wsClient.unsubscribeAll();
      wsClient.close();
      history.push('');
    } catch (e) {
      error = e;
    } finally {
      setAuthorizationProcessState(false);
    }

    return [user, error];
  };

  useEffect(() => {
    const authorizationToken = Cookies.getItem('authorizationToken');

    if (authorizationToken) {
      authorize();
    }
  }, []);

  const isUserAuthorized = !!authorizedUser;
  const isAdmin = isUserAuthorized && authorizedUser.role === 'admin';

  return (
    <AuthorizationProvider value={{
      user: authorizedUser,
      isAdmin,
      isUserAuthorized,
      signIn,
      signOut,
      authorize,
    }}>
      <ApolloProvider client={client}>
        {children}
      </ApolloProvider>
    </AuthorizationProvider>
  );
};

AuthorizationComponent.propTypes = {
  children: PropTypes.node,
  history: PropTypes.object,
};

export const AuthorizedApp = withRouter(AuthorizationComponent);

export default AuthorizationContext;
