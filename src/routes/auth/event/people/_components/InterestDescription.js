import React from 'react';

import Subheader from 'material-ui/Subheader';
// import {blue300} from 'material-ui/styles/colors';

import styles from './InterestDescription.css';

export default ({ children }) => {
  return (
    <div>
      <Subheader>
        <p className={styles.subheaderText}>
          {children}
        </p>
      </Subheader>
    </div>
  );
};
