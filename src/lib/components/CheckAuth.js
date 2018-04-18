import React from 'react';

import { Provider, defaultState } from '../context';
import PropTypes from 'prop-types';

import 'whatwg-fetch';

class AuthProvider extends React.Component  {
  constructor() {
    super();
    this.toggleLoading = this.toggleLoading.bind(this);
    this.fetchSuccess = this.fetchSuccess.bind(this);
    this.fetchFail = this.fetchFail.bind(this);
    this.refreshAuth = this.refreshAuth.bind(this);
    this.state = { ...defaultState, refreshAuth: this.refreshAuth };
  }
  componentDidMount () {
    if(this.props.authUrl ) {
      // make auth api fetch call and don't repeate api calls
      const oThis = this;
      const options = this.props.reqOptions || {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
      };
      this.toggleLoading();
      fetch(this.props.authUrl, options)
        .then(function(response) {
          if (response.status !== 200) {
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
        })
    }
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
    this.setState({ ...this.state, ...defaultState });
  }
  render() {
    return (
      <div>
        <Provider value={this.state}>
          { this.props.children }
        </Provider>
      </div>
    );
  }
}

AuthProvider.propTypes = {
  authUrl: PropTypes.string.isRequired,
  reqOptions: PropTypes.object.isRequired,
  children: PropTypes.node
};

export default AuthProvider;
