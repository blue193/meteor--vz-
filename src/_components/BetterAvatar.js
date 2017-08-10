import React from 'react';
import { renderIfElse } from 'lib/renderThunk';
import styles from './BetterAvatar.css';

const BetterAvatar = ({ src, firstName, lastName, size = 60, style = {} }) => {
  const firstLetter = firstName ? firstName.slice(0, 1) : '';
  const secondLetter = lastName ? lastName.slice(0, 1) : '';


  const baseStyles = {
    width: size,
    height: size,
  };

  return renderIfElse(src)(() => (
    <div
      className={styles.betterAvatar}
      style={{
        ...baseStyles,
        flex: `0 0 ${size}px`,
        backgroundPosition: '50%',
        backgroundImage: `url("${src}")`,
        backgroundSize: 'cover',
        ...style
      }}
    />
  ), () => (
    <div
      className={styles.betterAvatar}
      style={{
        ...baseStyles,
        flex: `0 0 ${size}px`,
        ...style
      }}
    >
      <span
        style={{
          color: '#fff',
          fontSize: size / 2.5,
          textTransform: 'uppercase',
        }}
      >
        {firstLetter}{secondLetter}
      </span>
    </div>
  ));
};

export default BetterAvatar;
