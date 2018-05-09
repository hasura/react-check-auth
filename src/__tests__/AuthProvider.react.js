import React from 'react';

import { AuthProvider, AuthConsumer } from '../lib';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import fetchMock from 'fetch-mock';

import { defaultState } from '../lib/context';

Enzyme.configure({ adapter: new Adapter() });

global.shallow = shallow;
global.render = render;
global.mount = mount;

fetchMock.get('end:/user/info', { id: 'id', username: 'username' });
fetchMock.post('end:/user/info', 404);
fetchMock.get('end:/user/noauth', 401);
fetchMock.get('end:/user/notJson', 'Not JSON');

afterEach(fetchMock.reset);
afterAll(fetchMock.restore);

describe('Auth Provider Simple Rendering', () => {
  it('should render without throwing an error', () => {
    expect(shallow(<AuthProvider authUrl="https://someapi.io/v1/user/info"><div>Hello Auth</div></AuthProvider>).exists(<div>Hello Auth</div>)).toBe(true)
  })
})

describe('Auth Provider Fetch', () => {
  const authEndpoint = 'https://someapi.io/v1/user/info';
  const reqOptions = { 
    'method': 'GET',
    'credentials': 'include',
    'headers': {
      'Content-Type': 'application/json'
    },  
  };

  it('Test no session', async () => {
    const successWrapper = shallow(<AuthProvider authUrl="https://someapi.io/v1/user/noauth" reqOptions={ reqOptions }></AuthProvider>);
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
    const newAuthEndpoint = 'https://someapi.io/v1/user/notJson';
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
    const successWrapper = shallow(<AuthProvider authUrl={ authEndpoint } reqOptions={ newReqOpts }></AuthProvider>);
    await successWrapper.instance().componentDidMount();
    expect(successWrapper.state(`userInfo`)).toHaveProperty('username', 'username');
    successWrapper.state(`refreshAuth`)()
    expect(successWrapper.state(`userInfo`)).toBeNull();
  });
})
