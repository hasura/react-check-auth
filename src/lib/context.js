import React from 'react';

const defaultState = {
  isLoading: false,
  userInfo: null,
  error: null,
  refreshAuth: () => true
};

const AuthContext = React.createContext(defaultState);
const { Provider, Consumer } = AuthContext;

export { AuthContext, Provider, Consumer, defaultState };
