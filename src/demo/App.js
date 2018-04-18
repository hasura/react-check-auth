import React from 'react';
import { AuthProvider, AuthConsumer } from '../lib';

import './App.css';

const logo = require('./hasura.png');

const authEndpoint = 'https://auth.commercialization66.hasura-app.io/v1/user/info';
const reqOptions = {
  'method': 'GET',
  'credentials': 'include',
  'headers': {
    'Content-Type': 'application/json'
  },
};

const App = (props) => (
  <AuthProvider authUrl = { authEndpoint } reqOptions={ reqOptions }>
    <div className="app_wrapper">
      <div className="header_wrapper">
        <div className="header_left">
          <div className="header_logo_icon">
            <img src={ logo } alt="Hasura"/>
          </div>
        </div>
        <ul>
          <li><span>Home</span></li>
          <li><span>News</span></li>
          <li><span>Contact</span></li>
          <li><span>About</span></li>
          <li>
            <span>
              <AuthConsumer>
                { ({ isLoading, userInfo, error, refreshAuth }) => {
                  if ( isLoading ) {
                    return (
                      <span>Loading...</span>
                    )
                  }
                  if ( error ) {
                    return (
                      <div>
                        Error: {error.message}
                      </div>
                    )
                  }
                  return (
                    !userInfo ? <div><a href={ `https://auth.commercialization66.hasura-app.io/ui?redirect_url=http://localhost:3000` }>Login </a></div> : <div> {`Hello ${ userInfo.username }`} <button onClick={ refreshAuth }>Logout </button></div>
                  );
                }}
              </AuthConsumer>
            </span>
          </li>
        </ul>
      </div>
      <div className="content_wrapper">
        <p>Proin cursus pulvinar justo at venenatis. Sed tortor velit, commodo commodo lacinia ut, dapibus non nulla. Aenean et rutrum massa. Aliquam eu enim hendrerit, varius ligula ac, faucibus neque. Mauris felis urna, pulvinar at lectus ut, sodales auctor sem. Aenean non dapibus velit, vitae blandit enim. Curabitur pharetra gravida elit eget eleifend. Cras erat purus, posuere a orci commodo, varius mollis est. In hac habitasse platea dictumst. Proin interdum egestas augue, non sagittis nulla interdum eget. Morbi eu massa eu turpis sodales placerat sed ut dui. Sed rhoncus metus eu dignissim congue. Phasellus dignissim mi sagittis sem ornare porttitor. Nam metus massa, sollicitudin sit amet massa nec, condimentum volutpat metus. Aliquam erat volutpat. Cras suscipit urna ut justo posuere, non tincidunt risus molestie.</p>
        <p> Maecenas ac ex ut massa viverra lobortis. Vivamus vel nibh dapibus, venenatis leo ac, fermentum odio. Nulla dapibus lectus at nisi dapibus, fringilla consequat mi consectetur. In eget imperdiet dui. Morbi congue dapibus lacinia. Nulla facilisi. Proin eu aliquam nibh. Sed ut mauris sed lectus interdum tincidunt. Donec suscipit, nunc eu ultrices dapibus, risus ex tempor nisl, eu commodo augue ligula tristique massa. Mauris vitae tincidunt diam. Donec mattis feugiat mauris a fringilla. Quisque eget magna lacinia, gravida libero id, efficitur mauris. Nulla in nisi at dui gravida ornare ut sed neque. Nam lectus nibh, molestie quis venenatis ut, porta vel magna.</p>
        <p>Mauris id vulputate metus, sit amet pretium metus. In vel eleifend sem, ut scelerisque neque. Nam vitae metus vel arcu ultricies mattis. Sed a pharetra velit. Integer ac lacus quis urna tincidunt aliquet eget in ex. Nam sapien sapien, tempus in nunc ut, dignissim egestas metus. Proin quis volutpat velit. Phasellus bibendum diam tortor, at feugiat magna lacinia nec. Suspendisse in vestibulum orci.</p>
        <p>Suspendisse potenti. Sed in convallis ex, nec varius tortor. Mauris quis consequat libero. Phasellus arcu libero, porta ut neque egestas, hendrerit viverra neque. Aliquam fermentum neque odio, at faucibus mi congue eleifend. Proin non imperdiet purus, in convallis nunc. Morbi pellentesque lectus urna, ut iaculis nisl tempus nec. Aliquam arcu mauris, ullamcorper at nibh porttitor, porta molestie mauris. Phasellus vel ex ut orci porta placerat. Aliquam pulvinar dui nisi, vel dignissim nulla varius nec. Sed semper ac libero eget condimentum. Nunc scelerisque tincidunt ante sit amet eleifend. Integer pellentesque, elit ut dignissim pellentesque, enim dolor viverra eros, vitae cursus massa arcu vitae lectus.  </p>
        <p>
          Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce egestas nibh vitae mollis blandit. Etiam pharetra sed massa vel rutrum. Phasellus condimentum tempor euismod. Praesent iaculis, nisl sit amet ullamcorper tempus, risus velit consequat eros, sed luctus odio purus eu nisi. Donec neque nisl, rhoncus ut malesuada ut, vestibulum eget odio. Sed ultricies justo id ipsum aliquet venenatis. Phasellus cursus sodales dui ac venenatis.</p>
        <p>Pellentesque mattis dignissim felis quis rhoncus. Ut in arcu ut magna aliquet ornare rutrum eu est. Nulla consequat diam eget lorem egestas interdum. Suspendisse potenti. Curabitur id arcu sed leo pulvinar elementum. Duis arcu diam, dapibus sed tellus sit amet, imperdiet cursus ligula. Nulla aliquet eros lectus, at commodo enim sollicitudin non. Morbi viverra pellentesque neque ut faucibus. Maecenas non ultricies quam, at pellentesque enim. In condimentum egestas est, id dignissim nunc dignissim quis. Praesent velit diam, dapibus a velit et, porta luctus purus. Vestibulum nec purus mollis, tincidunt mi sed, gravida dolor. Nunc tristique, sapien eget molestie dignissim, justo odio convallis nisl, a consequat risus dolor quis lorem. Nulla interdum congue ipsum sed bibendum. Nam lobortis dui ac luctus semper.</p>
        <p>
          Donec dictum est purus, vel semper odio hendrerit non. Suspendisse ac risus lacinia, tempor arcu vel, commodo arcu. Maecenas imperdiet arcu quis commodo consequat. Maecenas quam sapien, aliquam et quam vel, euismod posuere leo. Nullam a elit quis erat dictum facilisis. In hac habitasse platea dictumst. Mauris sit amet neque faucibus, ullamcorper ipsum nec, rutrum tortor. Donec varius, sem ac efficitur efficitur, mauris augue vehicula nibh, eget facilisis nisi dolor sed neque
        </p>
        <p>
          Fusce molestie at lorem a feugiat. Fusce sodales, orci ornare tempor pellentesque, nisi justo tempor leo, id eleifend dui odio porta augue. Praesent blandit mattis diam et molestie. Donec vel ornare est. Donec porta imperdiet gravida. Sed efficitur volutpat velit eget condimentum. Proin euismod nibh eu ipsum consectetur commodo. 
        </p>
      </div>
    </div>
  </AuthProvider>
);

export default App;
