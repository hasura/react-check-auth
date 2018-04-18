# check-auth

`check-auth` is a tiny react component helps you make auth checks declarative in your react or react-native app.
Any component can declaratively toggle based on whether the user is logged in or not.

This component uses React 16's new context API. This component is just ~100LOC, it's ideal to use as boilerplate/reference of using the new context API too to pass information from a component to arbitrarily deep child components.

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

### Backend requirements

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

## Setting up the `AuthProvider` component that wraps your app

### Use a GET endpoint with cookies

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

### Use a GET endpoint with a token

``` javascript
  import React from 'react';
  import {AuthProvider} from 'check-auth';

  const authUrl = "https://my-backend.com/verifyAuth";
  const reqOptions = { 
    'method': 'GET',
    'credentials': 'include',
    'headers': {
      'Content-Type': 'application/json'
    },  
  }; 
  const App = () => (
    <AuthProvider authUrl={authUrl}>
      // The rest of your app goes here
    </AuthProvider>
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

And inside your App.js component render, you can wrap it entirely with <CheckAuth>,

``` javascript
render () {
   <AuthProvider authUrl={authUrl}>
    <CheckAuth> 
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
    </CheckAuth>
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


## How it works

![How it works](https://raw.githubusercontent.com/hasura/check-auth/master/how-it-works.png?token=AX7uzNQcZ7FW-RTgFVzkUKaKLM_U26MQks5a4GzLwA%3D%3D)

## Contributing

Clone repo

````
git clone https://github.com/hasura/check-auth.git
````

Install dependencies

`npm install` or `yarn install`

Start development server

`npm start` or `yarn start`

Runs the demo app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Library files

All library files are located inside `src/lib`  

### Demo app

Is located inside `src/demo` directory, here you can test your library while developing

### Testing

`npm run test` or `yarn run test`

### Build library

`npm run build` or `yarn run build`

Produces production version of library under the `build` folder.

