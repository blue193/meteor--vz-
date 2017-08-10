import React from 'react';
import Profile from 'routes/auth/_components/Profile';
import Api from 'lib/api';
import Session from 'lib/session';

export default class extends React.Component {

  submitProfile = (profileFields) => {
    const attempts = Session.loadState(Session.PROFILE_COMPLETED).count || 0;
    Session.saveState(Session.PROFILE_COMPLETED, { count: attempts + 1 });

    Api
      .submitProfile(profileFields)
      .then(() => {
        Session.removeState(Session.PROFILE_STATE);
        Session.removeState(Session.PROFILE_COMPLETED);
        if (this.props.onSave) this.props.onSave();
      });
  }

  render() {
    return (
      <Profile buttonText={this.props.buttonText} editable submit={this.submitProfile} />
    );
  }
}
