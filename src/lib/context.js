import React from 'react';

const defaultState = {
  isLoading: true,
  userInfo: null,
  error: null,
  refreshAuth: () => true
};

const { Provider, Consumer } = React.createContext(defaultState);

export { Provider, Consumer, defaultState };
