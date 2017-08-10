import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default class extends React.Component {
  render() {
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onTouchTap={(e) => {
          e.preventDefault();
          this.props.closeDialog();
        }}
      />,
    ];

    return (
      <Dialog
        title="Oh no!"
        actions={actions}
        modal={true}
        open={this.props.showError}
        onRequestClose={() => {
          this.props.closeDialog()
        }}>
        <p style={{fontSize:14}}>
          An error has occured. If you continue to receive this message, please contact <a href="mailto:help@conferencesolutions.com">help@conferencesolutions.com</a>.
        </p>
      </Dialog>
    );
  }
}
