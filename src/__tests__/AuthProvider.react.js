import React from 'react';

import { AuthProvider, AuthConsumer } from '../lib';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { defaultState } from '../lib/context';

Enzyme.configure({ adapter: new Adapter() });

global.shallow = shallow;
global.render = render;
global.mount = mount;

describe('Auth Provider Simple Rendering', () => {
  it('should render without throwing an error', () => {
    expect(shallow(<AuthProvider authUrl="https://auth.abcd.io"><div>Hello Auth</div></AuthProvider>).exists(<div>Hello Auth</div>)).toBe(true)
  })
})

describe('Auth Provider Fetch', () => {
  const authEndpoint = 'https://auth.commercialization66.hasura-app.io/v1/user/info';                                                                  
  const reqOptions = { 
    'method': 'GET',
    'credentials': 'include',
    'headers': {
      'Content-Type': 'application/json'
    },  
  };

  it('Test no session', async () => {
    const successWrapper = shallow(<AuthProvider authUrl={ authEndpoint } reqOptions={ reqOptions }></AuthProvider>);
    await successWrapper.instance().componentDidMount();
    expect(successWrapper.state(`userInfo`)).toBeNull()
  })

  it('Test error fetch', async () => {
    const newReqOpts = { ...reqOptions };
    newReqOpts.method = 'POST';
    const successWrapper = shallow(<AuthProvider authUrl={ authEndpoint } reqOptions={ newReqOpts }></AuthProvider>);
    await successWrapper.instance().componentDidMount();
    // console.log('newReqOpts');
    // console.log(successWrapper.state())
    expect(successWrapper.state(`userInfo`)).toBeNull()
  })

  it('Test success fetch', async () => {
    const username = 'username';
    const token = 'token';
    const newReqOpts = { ...reqOptions };
    newReqOpts.method = 'GET';
    newReqOpts.headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    };
    delete newReqOpts.credentials;
    const successWrapper = shallow(<AuthProvider authUrl={ authEndpoint } reqOptions={ newReqOpts }></AuthProvider>);
    await successWrapper.instance().componentDidMount();
    expect(successWrapper.state(`userInfo`)).toHaveProperty('username': username);
  })

  it('Test fetch non-json', async () => {
    const newReqOpts = { ...reqOptions };
    newReqOpts.method = 'GET';
    newReqOpts.headers = {
      'Content-Type': 'application/json',
    };
    const newAuthEndpoint = 'https://bcbab947-cfc1-4128-b907-1a814f5f1c84.mock.pstmn.io/t1';
    const successWrapper = shallow(<AuthProvider authUrl={ newAuthEndpoint } reqOptions={ newReqOpts }></AuthProvider>);
    await successWrapper.instance().componentDidMount();
    expect(successWrapper.state(`error`)).toHaveProperty('name': 'FetchError');
  });

  it('Test refresh state', async () => {
    const newReqOpts = { ...reqOptions };
    newReqOpts.method = 'GET';
    newReqOpts.headers = {
      'Content-Type': 'application/json',
    };
    const newAuthEndpoint = 'https://bcbab947-cfc1-4128-b907-1a814f5f1c84.mock.pstmn.io/t2';
    const successWrapper = shallow(<AuthProvider authUrl={ newAuthEndpoint } reqOptions={ newReqOpts }></AuthProvider>);
    await successWrapper.instance().componentDidMount();
    expect(successWrapper.state(`userInfo`)).toHaveProperty('Hello': 'World');
    successWrapper.state(`refreshAuth`)()
    expect(successWrapper.state(`userInfo`)).toBeNull();
  });
})
