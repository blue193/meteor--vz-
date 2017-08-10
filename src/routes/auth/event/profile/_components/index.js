import React from 'react';

import styles from './index.css';
import { renderIfElse } from 'lib/renderThunk';
import EventSubheader from 'routes/auth/event/_components/Subheader';
import ProfileOnboarding from 'routes/auth/event-onboarding/profile/_components/ProfileOnboarding';
import QuestionsOnboarding from 'routes/auth/event-onboarding/questions/_components/QuestionsOnboarding';

import Button from '_components/Button';

export default class extends React.Component {
  static contextTypes = {
    router: React.PropTypes.any,
  }

  state = {
    showProf: true,
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.topContent}>
          <EventSubheader title={this.state.showProf ? "My Profile" : "Questions"}>
            <Button
              primary
              label={this.state.showProf ? "View Profile Questions" : "View Profile"}
              onClick={() => {
                this.setState({ showProf: !this.state.showProf });
              }} />
          </EventSubheader>
        </div>
        <div className={styles.content}>
          {renderIfElse(this.state.showProf)(() => (
            <ProfileOnboarding buttonText="Save" onSave={this.onSave} />
          ), () => (
            <QuestionsOnboarding buttonText="Save" onSave={this.onSave} />
          ))}
        </div>
      </div>
    );
  }
}
