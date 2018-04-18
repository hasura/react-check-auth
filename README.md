# check-auth

This tiny react component helps you make auth checks declarative in your react or react-native app.


The use-case is when:
1. the authentication is already done and you have a cookie or a header and
2. you want components arbitrarily spread somewhere in your app to be able to toggle based on whether the user is logged in or not

This component uses React 16's new context API. Considering the size of this component, it's ideal to use a boilerplate/reference of using the new context API too!

## Example 1: Creating a header that shows a "Welcome user" or a Login button

``` javascript
  import {AuthProvider, AuthConsumer} from 'check-auth';

  const Header = () => (
    <AuthProvider authEndpoint={ 'http://localhost:8080/user/info' }>
      // Some header items
      // ...

      // Now the part that depends on the user being logged in
      <AuthConsumer>
        {({userInfo}) => {

          // .. code to check if userInfo is not null and return the corresponding jsx
          ...

          // If userinfo doesn't exist return the corresponding jsx
        }}
       </AuthConsumer>
    </AuthProvider>
  );
```

## Example 2: Routing with react-router based on the user being logged in

``` javascript
  import {AuthProvider, AuthConsumer} from 'check-auth';

  const Main = () => (
    <AuthProvider authEndpoint={ 'http://localhost:8080/user/info' }>
      // Some header items
      // ...

      <AuthConsumer>

        {({userInfo, isLoading, error}) => {

          // If userInfo is not null
          return (<Route path='/home' component={Home}/>);

          // If the request is being fetched
          return (...)

          // If error occurs
          return <Route path='/error' component={Error}/>
        }

      </AuthConsumer>
    </AuthProvider>
);
```

## Installation

``` bash

$ npm install --save check-auth
```

## Simple Usage

``` javascript
  import React from 'react';
  import {AuthProvider, AuthConsumer} from 'check-auth';

  const App = () => (
    <div>
     <AuthProvider authUrl={authUrl} reqObj={reqObj}>
      <AuthConsumer>
        { ({ isLoading, userInfo, error }) => {
          if ( isLoading ) {
            return ( <span>Loading...</span> )
          }
          return ( !userInfo ?
            (<div>
              <a href={'https://auth.commercialization66.hasura-app.io/ui?redirect_url=http://localhost:3000'}>Login</a>
            </div>)
            :
            (<div>
              {Hello ${ userInfo.username }}
            </div>) );
        }}
       </AuthConsumer>
      </AuthProvider>
    </div>
  );
```

## Use Cases

`React Check Auth` can be applied to common use cases like:

### Frontend Session Management

In a typical web ui, the header component of your application will have navigation links, signup/signin links or logged in user's profile information, depending on whether the user is logged in or not.
The hard part about showing user information or Login button is that your react app needs to make an Auth API call to fetch session information, maintain state and boilerplate code has to be written to handle this. You also need to make sure that state is available anywhere within your child components as well.

``` javascript
  import React from 'react';
  import { AuthProvider, AuthConsumer } from 'check-auth';


  const Header = () => (
    <div>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About Us</a></li>
        <AuthProvider authUrl={authUrl}>
          <AuthConsumer>
            { ({ isLoading, userInfo, error }) => {
              if ( isLoading ) {
                return ( <span>Loading...</span> )
              }
              if ( userInfo ) {
                return (
                  <li>
                    {Hello ${ userInfo.username }}
                  </li)
                );
              } else {
                return (
                  <li>
                    <a href="/login">Login</a>
                  </li>
                );
              }
            }}
          </AuthConsumer>
        </AuthProvider>
      </ul>

    </div>
  );
```

### Using with React Router

With React Router v4, you can call the Route inside your CheckAuth component or wrap your entire application with CheckAuth, like this -

``` javascript
  import React from 'react';
  import { Route, Switch } from 'react-router-dom';

  import App from './App.js'
  import SigninPage from './SigninPage';

  export default () => (
    <Switch>
      <Route path='/home' component={App}/>
      <Route path='/signin' component={SiginPage}/>
    </Switch>
);

```

And inside your App.js component render, you can wrap it entirely with `CheckAuth`,

``` javascript
render () {
   <AuthProvider authUrl={authUrl}>
    <AuthConsumer>
      { ({ isLoading, userInfo, error }) => {
        if ( isLoading ) {
          return ( <span>Loading...</span> )
        }
        return ( !userInfo ?
          (<div>
            Please Login
          </div>)
          :
          (<div>
            {Hello ${ userInfo.username }}
            <Route component={myApp} />
          </div>) );
      }}
    </AuthConsumer>
  }
```

### Third-party Auth Providers

#### Hasura

Hasura's Auth API can be integrated with this module with a simple auth get endpoint  and can also be used to redirect the user to Hasura's Auth UI Kit in case the user is not logged in.

```
  // replace CLUSTER_NAME with your Hasura cluster name.
  const authEndpoint = 'https://auth.[CLUSTER_NAME].hasura-app.io/v1/user/info';

  // pass the above reqObject to CheckAuth
  <AuthProvider authUrl={authEndpoint}>
    <AuthConsumer>
    { ({ isLoading, userInfo, error }) => {
      // your implementation here
    } }
    </AuthConsumer>
  </AuthProvider>
```


#### Firebase

`CheckAuth` can be integrated with Firebase APIs.

```
  // replace API_KEY with your Firebase API Key and ID_TOKEN appropriately.
  const authUrl = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=[API_KEY]';
  const reqObject = { 'method': 'POST', 'payload': {'idToken': '[ID_TOKEN]'}, 'headers': {'content-type': 'application/json'}};

  // pass the above reqObject to CheckAuth
  <AuthProvider authUrl={authUrl} reqObject={reqObject}>
    <AuthConsumer>
    { ({ isLoading, userInfo, error }) => {
      // your implementation here
    } }
    </AuthConsumer>
  </AuthProvider>
```

#### Custom Provider

`CheckAuth` can be integrated with any custom authentication provider APIs.

Lets assume we have an endpoint on the backend `/api/check_token` which reads a header `x-access-token` from the request and provides with the associated user information

```
  const authEndpoint = 'http://localhost:8080/api/check_token';
  const reqOptions = {
    'method': 'GET',
    'headers': {
      'Content-Type': 'application/json',
      'x-access-token': 'jwt_token'
    }
  };

  <AuthProvider authUrl = { authEndpoint } reqOptions={ reqOptions }>
    <AuthConsumer>
      { ( { isLoading, userInfo, error, refreshAuth }) => {
        if ( !userInfo ) {
          return (
            <span>Please login</span>
          );
        }
        return (
          <span>Hello { userInfo ? userInfo.username.name : '' }</span>
        );
      }}
    </AuthConsumer>
  </AuthProvider>
```

It will render as `<span>Please login</span>` if the user's token is invalid and if the token is a valid one it will render <span>Hello username</span>

### Using with React Native

In case of React Native, you need to send the Authorization header to the `<AuthProvider>` since cookies are not cached in React Native. Rest of the workflow is exactly the same as React.

``` javascript

import { AuthProvider, AuthConsumer } from 'react-vksci123';

export default class App extends Component<Props> {
  render() {
    const sessionToken = AsyncStorage.getItem("@mytokenkey");
    const reqOptions = {
      "method": "GET",
      "headers": sessionToken ? { "Authorization" : `Bearer ${sessionToken}` } : {}
    }
    return (
      <AuthProvider authUrl={`https://auth.conversion36.hasura-app.io/v1/user/info`}
      reqOptions={reqOptions}>
        <View style={styles.container}>
          <Text style={styles.welcome}>
            Welcome to React Native!
          </Text>
          <AuthConsumer>
            {({isLoading, userInfo, error}) => {
              if (isLoading) {
                return (<ActivityIndicator />);
              }
              if (error) {
                return (<Text> Unexpected </Text>);
              }
              if (!userInfo) {
                return (<LoginComponent />);
              }
              return (<HomeComponent />);
            }}
          </AuthConsumer>
        </View>
      </AuthProvider>
    );
  }
}

```

## How it works

![How it works](https://github.com/hasura/react-check-auth/blob/master/how-it-works.png)
