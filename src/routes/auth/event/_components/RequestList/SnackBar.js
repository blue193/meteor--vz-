import React from 'react';
import Snackbar from 'material-ui/Snackbar';

import {colors} from 'styles/colors';

export default class extends React.Component {
  state = {
    open: false
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ open: !!nextProps.message && this.props.message !== nextProps.message });
  }

  handleRequestClose = () => {
    this.setState({ open: false })
  }

  render() {
    const style = window.innerWidth >= 990 ? ({}) : ({bottom:56});

    return (
      <div>
        <Snackbar
          style={style}
          open={this.state.open}
          message={this.props.message}
          onRequestClose={this.handleRequestClose}
          autoHideDuration={3000}
          contentStyle={{color: colors.orange0, textAlign: 'center'}}
        />
      </div>
    )
  }
}
