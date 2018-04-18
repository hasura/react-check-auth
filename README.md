# react-check-auth

## Installation

``` bash
$ npm install --save react-check-auth
```

## Simple Usage

``` javascript
  import React from 'react';
  import {AuthProvider, AuthConsumer} from 'react-check-auth';

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
  import { AuthProvider, AuthConsumer } from 'react-check-auth';
  

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

#### Auth0


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

### Library files

All library files are located inside `src/lib`  

### Demo app

Is located inside `src/demo` directory, here you can test your library while developing

### Testing

`npm run test` or `yarn run test`

### Build library

`npm run build` or `yarn run build`

Produces production version of library under the `build` folder.

