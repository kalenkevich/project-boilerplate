import React, { Suspense, lazy, useContext } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, Switch } from 'react-router-dom';

import AuthorizationContext from '../contexts/AuthorizationContext';
import routes from '../constants/routes';

export const ProtectedRoute = (props) => {
  const {
    component: RouteComponent,
    canAccess,
    redirectTo = '/login',
    ...rest
  } = props;

  if (!canAccess && redirectTo === '/login') {
    return null;
  }

  return (
    <Route
      {...rest}
      render={renderProps => (canAccess ? <RouteComponent {...renderProps} /> : <Redirect to={redirectTo}/>)}
    />
  );
};

ProtectedRoute.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.any,
  ]),
  canAccess: PropTypes.bool,
  redirectTo: PropTypes.string,
};

export const MainPage = lazy(
  () => import(/* webpackChunkName: "MainPage" */ '../pages/MainPage'),
);
export const SignInPage = lazy(
  () => import(/* webpackChunkName: "SignInPage" */ '../pages/SignInPage'),
);
export const SignUpPage = lazy(
  () => import(/* webpackChunkName: "SignUpPage" */ '../pages/SignUpPage'),
);
export const SignOutPage = lazy(
  () => import(/* webpackChunkName: "SignOutPage" */ '../pages/SignOutPage'),
);
export const ResetPasswordPage = lazy(
  () => import(/* webpackChunkName: "ResetPasswordPage" */ '../pages/ResetPasswordPage'),
);

const ApplicationRoutes = () => {
  const {
    isUserAuthorized,
    isAdmin,
  } = useContext(AuthorizationContext);

  return (
    <Suspense fallback={<div/>}>
      <Switch>
        <ProtectedRoute
          exact={true}
          canAccess={true}
          path={routes.main}
          component={MainPage}
        />
        <ProtectedRoute
          exact={true}
          canAccess={true}
          path={routes.signIn}
          component={SignInPage}
        />
        <ProtectedRoute
          exact={true}
          canAccess={true}
          path={routes.signUp}
          component={SignUpPage}
        />
        <ProtectedRoute
          exact={true}
          canAccess={true}
          path={routes.signOut}
          component={SignOutPage}
        />
        <ProtectedRoute
          exact={true}
          canAccess={true}
          path={routes.reset}
          component={ResetPasswordPage}
        />
        <Redirect from={'/'} to={'/main'}/>
      </Switch>
    </Suspense>
  );
};

ApplicationRoutes.propTypes = {
  authorizedUser: PropTypes.object,
};

export default ApplicationRoutes;
