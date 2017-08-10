import React from 'react';
import QuestionsOnboarding from './QuestionsOnboarding';
import styles from './index.css';
import {grey700} from 'material-ui/styles/colors';
import Divider from 'material-ui/Divider';


export default class extends React.Component {
  static contextTypes = {
    router: React.PropTypes.any,
  }

  onSave = () => {
    this.context.router.push('/');
  }

  render() {
    return (
      <div className={styles.container}>
        <p className={styles.header}>Questions</p>
        <p className={styles.subHeader} style={{color: grey700}}>Please review your responses for best matches.</p>
        <Divider />
        <QuestionsOnboarding onSave={this.onSave} buttonText="Submit" />
      </div>
    );
  }
}
