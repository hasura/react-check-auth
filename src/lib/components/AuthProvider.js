import React from 'react';

import { Provider, defaultState } from '../context';
import PropTypes from 'prop-types';
// import fetch from 'isomorphic-fetch';

class AuthProvider extends React.Component  {
  constructor() {
    super();
    this.toggleLoading = this.toggleLoading.bind(this);
    this.fetchSuccess = this.fetchSuccess.bind(this);
    this.fetchFail = this.fetchFail.bind(this);
    this.refreshAuth = this.refreshAuth.bind(this);
    this.state = { ...defaultState, refreshAuth: this.refreshAuth };
    this.allowed_status_codes = [200, 201, 202];
  }
  componentDidMount () {
    if (this.props.authUrl) {
      return this.fetchInfo();
    }
    return Promise.reject();
  }
  toggleLoading() {
    this.setState({ ...this.state, isLoading: true, userInfo: null, error: null });
  }
  fetchSuccess(data) {
    this.setState({ ...this.state, userInfo: data, isLoading: false, error: null });
  }
  fetchFail(err) {
    this.setState({ ...this.state, userInfo: null, isLoading: false, error: err});
  }
  refreshAuth() {
    this.fetchInfo();
  }
  fetchInfo() {
    const oThis = this;
    const { reqOptions } = this.props;

    let options = {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    };

    if (!!reqOptions && typeof reqOptions === 'function') {
      options = reqOptions();
    } else if (!!reqOptions) {
      options = reqOptions;
    }

    this.toggleLoading();
    return fetch(this.props.authUrl, options)
      .then(function(response) {
        if (!this.allowed_status_codes.includes(response.status)) {
          return response.json()
          .then((r) => {
            return Promise.reject(r)
          });
        }
        return response.json();
      }).then(function(json) {
        oThis.fetchSuccess(json);
      }).catch(function(ex) {
        oThis.fetchFail(ex);
      });
  }
  render() {
    return (
      <Provider value={this.state}>
        { this.props.children }
      </Provider>
    );
  }
}

AuthProvider.propTypes = {
  authUrl: PropTypes.string.isRequired,
  reqOptions: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object
  ]),
  children: PropTypes.node
};

export default AuthProvider;
