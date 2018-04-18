import React from 'react';
import PropTypes from 'prop-types';

import { Consumer } from '../context';

class AuthConsumer extends React.Component {
  render() {
    return (
      <Consumer>
        { (props) => this.props.children( { ...props })}
      </Consumer>
    );
  }
};

AuthConsumer.propTypes = {
  children: PropTypes.func.isRequired,
};

export default AuthConsumer;
