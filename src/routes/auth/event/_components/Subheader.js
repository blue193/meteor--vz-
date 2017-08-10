import React from 'react';
import styles from './Subheader.css';

export default class extends React.Component {
  render() {
    return (
      <div className={styles.container} style={{backgroundColor: '#fff'}}>
        {this.props.children}
        <span className={styles.title} style={{color: '#fff', flex: 'none'}} children={this.props.title} />
      </div>
    );
  }
};
