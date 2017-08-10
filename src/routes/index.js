import React from 'react';
import authRoutes from 'routes/auth';
import publicRoutes from 'routes/public';
import errorRoutes from 'routes/errors';
import ErrorDialog from '_components/ErrorDialog';
import Api from 'lib/api';

class component extends React.Component {
  state = {
    showError: false,
  }

  componentDidMount() {
    Api.setErrModalFn(this.setErrModalFn);
  }

  componentWillUnmount() {
    Api.setErrModalFn(null);
  }

  setErrModalFn = (showError) => {
    this.setState({ showError });
  }

  render() {
    return (
      <div>
        {this.props.children}
        <ErrorDialog showError={this.state.showError} closeDialog={() => this.setErrModalFn(false) } />
      </div>
    );
  }
};

export default {
  component,
  childRoutes: [
    authRoutes,
    publicRoutes,
    errorRoutes,
  ],
};
