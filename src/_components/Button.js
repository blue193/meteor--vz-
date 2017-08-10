import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import PropTypes from 'prop-types';

import {colors} from 'styles/colors';

const buttonStyles = {
  base: {
    flex: 'none',
    border: 'solid 1px #6d7275',
    lineHeight: 1
  },

  primary: {
    border: 'none'
  },

  small: {
    borderRadius: 14,
    height: 28
  },

  medium: {
    borderRadius: 20,
    height: 35
  },
};

const labelStyles = {
  base: {
    color: colors.grey3,
    lineHeight: 1.8
  },

  small: {
    margin: '0 10px',
    fontWeight: 'bold',
    fontSize: 9
  },

  medium: {
    margin: '0 20px',
    fontWeight: '700',
    fontSize: 14
  },
};

const Button = (props) => {
  const buttonStyle = Object.assign(
      {},
      buttonStyles.base,
      props.style,
      props.primary ? buttonStyles.primary : {},
      props.size === 'small' ? buttonStyles.small : {},
      props.size === 'medium' ? buttonStyles.medium : {}
    );
  const labelStyle = Object.assign(
      {},
      labelStyles.base,
      props.size === 'small' ? labelStyles.small : {},
      props.size === 'medium' ? labelStyles.medium : {}
    );

  return (
    <FlatButton
      backgroundColor={props.primary ?  colors.orange1 : ''}
      hoverColor={props.primary ? colors.orange0 : ''}
      primary={props.primary}
      label={props.label}
      disabled={props.disabled}
      labelStyle={labelStyle}
      style={buttonStyle}
      onTouchTap={e => {
        e.preventDefault();
        e.stopPropagation();
        if (props.onClick)
          props.onClick();
      }}
    />
  )
};

Button.defaultProps = {
  size: 'medium',
  disabled: false,
  primary: false
};

Button.propTypes = {
  label: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  primary: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large'])
};

export default Button;
