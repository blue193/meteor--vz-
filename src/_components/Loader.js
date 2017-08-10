import React from 'react';
import styles from './Loader.css';
import {grey400} from 'material-ui/styles/colors';

export default () => {
  return (
    <div className={styles.container}>
      <div className={styles.outer}>
        <div className={styles.inner1}></div>
        <div className={styles.inner2}></div>
        <div className={styles.inner4}></div>
        <div className={styles.inner3}></div>
      </div>
      <p className={styles.loaderText} style={{color: grey400}} children="Loading" />
    </div>
  );
};
