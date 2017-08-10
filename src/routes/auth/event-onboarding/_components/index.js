import React from 'react';
import SideNavigation from 'routes/auth/event/_components/SideNavigation';
import styles from './index.css';

export default ({ children }) => {
  return (
    <div className={styles.contain}>
      <div className={styles.sideNav}>
        <SideNavigation disableSome={true} />
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  )
}
