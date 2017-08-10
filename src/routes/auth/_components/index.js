import React from 'react';

import Header from './Header';
import SearchBar from './SearchBar';
import styles from './index.css';


export default ({ children }) => {
  const header = <Header />;
  return (
    <div className={styles.container}>
      <div className={styles.header} children={header} />
      <SearchBar/>
      <div className={styles.content} children={children} />
    </div>
  );
};
