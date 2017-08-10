import React from 'react';
import ProfileOnboarding from './ProfileOnboarding';
import Divider from 'material-ui/Divider';
import styles from './index.css';
import {grey700} from 'material-ui/styles/colors';


export default class extends React.Component {
  static contextTypes = {
    router: React.PropTypes.any,
  }

  onSave = () => {
    this.context.router.push('/event-onboarding/questions');
  }

  render() {
    return  (
      <div className={styles.container}>
        <p className={styles.header}>Welcome!</p>
        <p className={styles.subHeader} style={{color: grey700}}>Please complete your profile to continue.</p>
        <Divider />
        <ProfileOnboarding onSave={this.onSave} buttonText="Continue"/>
      </div>
    );
  }
}
