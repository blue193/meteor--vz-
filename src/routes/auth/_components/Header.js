import React from 'react';
import {connect} from 'react-redux';
import {Spinner} from 'react-redux-spinner';
import MediaQuery from 'react-responsive';

import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';

import auth from 'lib/auth';
import {changeSearchTerm} from 'actions/global';
import {cssStyles} from 'styles/overrides';
import {colors} from 'styles/colors';
import {searchIcon} from 'styles/icons';
import {runIcon} from 'styles/icons';

import {toggleShowSearchPanel} from 'actions/panels';

let MainAppBar = (props, context) => (
  <AppBar
    style={cssStyles.appBar.root}
    title={
      <img
        role="presentation"
        src={props.eventSettings.logo}
        style={cssStyles.appBar.title}
      />
    }
    iconElementRight={
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <MediaQuery query='(min-device-width: 768px)'>
          <div
            id="searchButton"
            className="group"
            style={{position: 'relative'}}>
            <FontIcon
              className="icon icon-basic-magnifier"
              style={{color: colors.orange0, position: 'absolute', top: 12, left: 16}}/>
            <TextField
              hintText="Search"
              hintStyle={{color: colors.orange0, fontWeight: 300, fontSize: 14}}
              inputStyle={{color: colors.orange0, fontSize: 14}}
              style={{
                border: 'solid 1px #e69137',
                borderRadius: 30,
                color: colors.orange0,
                paddingLeft: 50,
                width: 500,
                height: 45
              }}
              underlineShow={false}
              onChange={(e) => {
                props.changeSearchTerm(e.target.value)
              }}
            />
          </div>
        </MediaQuery>
        <MediaQuery query='(max-device-width: 767px)'>
          <IconButton
            onTouchTap={(e) => {
              e.preventDefault();
              props.toggleShowSearchPanel();
            }}
            iconStyle={{
              color: props.showSearchPanel ? colors.orange1 : colors.grey0
            }}>
            {searchIcon}
            </IconButton>
            <IconButton
              onTouchTap={auth.logOut}
              iconStyle={{
                color: colors.grey0
              }}>
              {runIcon}
            </IconButton>
        </MediaQuery>
      </div>
    }
    showMenuIconButton={false}
  >
    <Spinner config={{ trickleRate: 0.2, showSpinner: false}}/>
  </AppBar>
);

const mapStateToProps = (state) => {
  return {
    eventSettings: state.event.settings,
    showSearchPanel: state.panels.showSearchPanel
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeSearchTerm: (text) => dispatch(changeSearchTerm(text)),
    toggleShowSearchPanel: () => dispatch(toggleShowSearchPanel()),
  };
};

MainAppBar = connect(mapStateToProps, mapDispatchToProps)(MainAppBar);

export default MainAppBar;
