# check-auth

`check-auth` is a tiny react component helps you make auth checks declarative in your react or react-native app.
Any component can declaratively toggle based on whether the user is logged in or not.

This component uses React 16's new context API. This component is just ~100LOC, it's ideal to use as boilerplate/reference of using the new context API too to pass information from a component to arbitrarily deep child components.

# Motivation

In a typical app UI, once the user logs in, different components in the application will display different infomration depending on whether the user is logged in or not. For example, a "welcome user" label or a "login button" on a Header. 

More commonly, routing or certain app components need to be protected. For example, `/home` should redirect to `/login` if the user is not logged in and `/login` should redirect to `/home` if the user is logged in.

## Before `check-auth`

The *irritating* work required to implement this is that:
1. On load, your app must make a request to some kind of a verifyUser or a fetchUser endpoint to check if the existing persisted token/cookie is available and valid
2. You need to store that information in app state and pass it as a prop all through your component tree just so that that child components can access it
3. Or you can use something like `redux` to store the state and `connect()` any component that needs this information

## After `check-auth`

1. You specify the `authUrl` endpoint as a prop to a wrapper component called `<AuthProvider`.
2. You access logged-in information using a child component called `<AuthConsumer>` that you can use anywhere in the app

You don't need to make an API request, or pass props around, or manage state/reducers/connections in your app.

# Examples

## Example 0: Setup for web (if signin/login had set a cookie)

Wrap your react app in a `AuthProvider` component that has an endpoint to fetch basic user information. This works because if the user had logged in, a cookie would already be present. For using authorization headers, check the docs after the examples.

```javascript
import React from "react";
import ReactDOM from "react-dom";

import {AuthProvider} from "check-auth";
import {Header, Main} from "./components";

const App = () => (
  <AuthProvider authUrl={'https://website.com/get/userInfo'}>
    <div>
      // The rest of your react app goes here
      <Header />
      <Main />
    </div>
  </AuthProvider>
);

ReactDOM.render(<App />, document.getElementById("root"));
```

## Example 1: Show a "welcome user" or a Login button

Now, in any arbitrary component, like a Header, you can check if the user is currently logged in. Typically you would use this for either showing a "welcome" label or a login button.

``` javascript
  import {AuthConsumer} from 'check-auth';

  const Header = () => (
    <div>      
      // Use the AuthConsumer component to check 
      // if userInfo is available
      <AuthConsumer> 
        {({userInfo, isLoading, error}) => ( 
          userInfo ?
            (<span>Hi {userInfo.username}</span>) :
            (<a href="/login">Login</a>)
        )}
       </AuthConsumer>
    </div>
  );
```

## Example 2: Redirect routes based on the user being logged in

You can mix and match `check-auth` with other declarative components like routing:

``` javascript
  import {AuthConsumer} from 'check-auth';

  const Main = () => (
    <Router>
      <Route path='/home' component={Home} />
      <Route path ='/login' component={Login} />
    </Router>
   );
   
   const Home = () => {
     return (
       <AuthConsumer>
         {({userInfo}) => {

           // Redirect the user to login if they are not logged in
           if (!userInfo) {
              return (<Redirect to='/login' />);
           } 
           
           // Otherwise render the normal component
           else {
             return (<div>Welcome Home!</div>);
           }
         }}
       </AuthConsumer>
     );
   }
);
```


# Usage guide

## Backend requirements

These are the backend requirements that are assumed by `react-check-auth`.

### 1) API endpoint to return user information

An API request to fetch user information. It should take a cookie, or a header or a body for current session information.

For example:
```http
GET https://my-backend.com/api/user
Content-Type: application/json
Cookie: <...>
Authorization: Bearer <...>
```

### 2) Success or logged-in response

If the user is logged in, the API should return a `200` status code with a `JSON` object.

For example:
```json
{
  "username": "iamuser",
  "id": 123
}
```

### 3) Not logged-in response

If the user is not logged-in, the API should return a **non `200`** status code:

For example:
```http
Status: 403
```

## Installation

``` bash
$ npm install --save check-auth
```

## Set up `AuthProvider`

The `AuthProvider` component should be at the top of the component tree so that any other component in the app can consume the `userInfo` information.

The `AuthProvider` takes a required prop called `authUrl` and an optional prop called `reqOptions`.

```javascript
<AuthProvider authUrl="https://my-backend.com/api/user" reqOptions={requestOptionsObject} />
```

#### `authUrl` :: String
Should be a valid HTTP endpoint. Can be an HTTP endpoint of any method.


#### `reqOptions` :: Object
Should be a valid `fetch` options object as per https://github.github.io/fetch/#options.

**Note: This is an optional prop that does not need to be specified if your `authUrl` endpoint is a GET endpoint that accepts cookies.**

Default value that ensures cookies get sent to a `GET` endpoint:
```json
{ 
  "method": "GET",
  "credentials": "include",
  "headers": {
    "Content-Type": "application/json"
  },  
}
```

### Example 1: Use a GET endpoint with cookies

``` javascript
  import React from 'react';
  import {AuthProvider} from 'check-auth';

  const authUrl = "https://my-backend.com/verifyAuth";
  
  const App = () => (
    <AuthProvider authUrl={authUrl}>
      // The rest of your app goes here
    </AuthProvider>
  );
```

### Example 2: Use a GET endpoint with a header

``` javascript
  import React from 'react';
  import {AuthProvider} from 'check-auth';

  const authUrl = "https://my-backend.com/verifyAuth";
  const reqOptions = { 
    'method': 'GET',
    'headers': {
      'Content-Type': 'application/json',
      'Authorization' : 'Bearer ' + window.localStorage.myAuthToken
    },  
  }; 
  
  const App = () => (
    <AuthProvider authUrl={authUrl} reqOptions={reqOptions}>
      // The rest of your app goes here
    </AuthProvider>
  );
```

## Consuming auth state with `<AuthConsumer>`

Any react component or element can be wrapped with an `<AuthConsumer>` to consume the latest contextValue. You must write your react code inside a function that accepts the latest contextValue. Whenver the contextValue is updated then the AuthComponent is automatically re-rendered.

For example,
```javascript
<AuthConsumer>
  {(props) => {
    
    props.userInfo = {..}        // <request-object> returned by the API
    props.isLoading = true/false // if the API has not returned yet
    props.error = {..}           // <error-object> if the API returned a non-200 or the API call failed
  }}
</AuthConsumer>
```

#### `props.userInfo` :: JSON

If the API call returned a 200 meaning that the current session is valid, `userInfo` contains <request-object> as returned by the API.

If the API call returned a non-200 meaning that the current session is absent or invalid, `userInfo` is set to `null`.

#### `props.isLoading` :: Boolean

If the API call has not returned yet, `isLoading: true`. If the API call has not been made yet, or has completed then `isLoading: false`.


#### `props.error` :: JSON

If the API call returned a non-200 or there was an error in making the API call itself, `error` contains the parsed JSON value.


## Refresh state (eg: logout)

If you implement a logout action in your app, the auth state needs to be updated. All you need to do is call the `refreshAuth()` function available as an argument in the renderProp function of the `AuthConsumer` component.

For example:
```javascript

<AuthConsumer>
  {(refreshAuth) => (
    <button onClick={{
      this.logout() // This is a promise that calls a logout API
        .then(
          () => refreshAuth()
        );
    }}>
      Logout
    </button>
</AuthConsumer>  
```

This will re-run the call to `authUrl` and update all the child components accordingly.


## Plug-n-play with existing auth providers

All Auth backend providers provide an endpoint to verify a "session" and fetch user information. This package itself was motivated by making it easier to integrate Hasura's auth API into your react app and minimise boilerplate. That said this package is meant to be used with any auth provider, including your own.

#### Hasura

Hasura's Auth API can be integrated with this module with a simple auth get endpoint  and can also be used to redirect the user to Hasura's Auth UI Kit in case the user is not logged in.

```
  // replace CLUSTER_NAME with your Hasura cluster name.
  const authEndpoint = 'https://auth.CLUSTER_NAME.hasura-app.io/v1/user/info';

  // pass the above reqObject to CheckAuth
  <AuthProvider authUrl={authEndpoint}>
    <AuthConsumer>
    { ({ isLoading, userInfo, error }) => { 
      // your implementation here
    } }
    </AuthConsumer>
  </AuthProvider>
```

Read the docs here.

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
      <AuthProvider
        authUrl={`https://my-backend.com/api/user`}
        reqOptions={reqOptions}
      >
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

![How it works](https://raw.githubusercontent.com/hasura/check-auth/master/how-it-works.png?token=AX7uzNQcZ7FW-RTgFVzkUKaKLM_U26MQks5a4GzLwA%3D%3D)

1. The `AuthProvider` component uses the `authUrl` and `reqOptions` information given to it to make an API call
2. While the API call is being made, it sets the context value to have `isLoading` to `true`.
```json
{
  "userInfo": null,
  "isLoading": true,
  "error": null
}
```
3. Once the API call returns, in the context value `isLoading` is set to `false' and:
4. Once the API call returns, if the user is logged in, the AuthProvider sets the context to `userInfo: <response-object>`
```json
{
  "userInfo": <response-object>,
  "isLoading": false,
  "error": null
}
```
5. If the user is not logged in, in the context value, `userInfo` is set to `null` and `error` is set to the error response sent by the API, if the error is in JSON.
```json
{
  "userInfo": null,
  "isLoading": false,
  "error": <error-response>
}
```
6. If the API call fails for some other reason, `error` contains the information

```json
{
  "userInfo": null,
  "isLoading": false,
  "error": <error-response>
}
```
7. Whenever the contextValue is updated, any component that is wrapped with `AuthConsumer` will be re-rendered with the contextValue passed to it as an argument in the renderProp function:

```javascript
<AuthConsumer>
  { ({userInfo, isLoading, error}) => {
     return (...);
  }}
<AuthConsumer>
```

## Contributing

Clone repo

````
git clone https://github.com/hasura/react-check-auth.git
````

Install dependencies

`npm install` or `yarn install`

Start development server

`npm start` or `yarn start`

Runs the demo app in development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Source code

The source code for the react components are located inside `src/lib`.  

### Demo app

A demo-app is located inside `src/demo` directory, which you can use to test your library while developing.

### Testing

`npm run test` or `yarn run test`

### Build library

`npm run build` or `yarn run build`

Produces production version of library under the `build` folder.

## Maintainers

This project has come out of the work at [hasura.io](https://hasura.io). 
Current maintainers [@Praveen](https://twitter.com/praveenweb), [@Karthik](https://twitter.com/k_rthik1991), [@Rishi](https://twitter.com/_rishichandra). 
