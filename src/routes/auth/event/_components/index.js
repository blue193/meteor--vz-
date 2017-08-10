import React from 'react';
import BottomNavigation from './BottomNavigation';
import SideNavigation from './SideNavigation';
import styles from './index.css';

export default ({ children }) => {
  return (
    <div className={styles.container}>
      <div className={styles.sideNavigation}>
        <SideNavigation />
      </div>
      <div className={styles.content} children={children} />
      <div className={styles.bottomNavigation}>
        <BottomNavigation />
      </div>
    </div>
  );
};
