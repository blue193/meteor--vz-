import React from 'react';
import {connect} from 'react-redux';
import MediaQuery from 'react-responsive';

import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import {colors} from 'styles/colors';

let SortBar = class extends React.Component {
  render() {
    return (
      <div style={{display: 'block', borderBottom: 'solid 1px #cccdcd'}}>
        <Toolbar style={{padding: '0 5px', backgroundColor: '#fff'}}>
          <ToolbarGroup
            id="sortButton">
            <ToolbarTitle
              text="SORT:"
              style={{paddingLeft: 30, paddingRight: 10, fontSize: 12, fontWeight: '900', color: colors.grey6}}/>
            <SelectField
              labelStyle={{fontSize: 12}}
              value={this.props.sortBy}
              onChange={
                (event, index, value) => {
                  this.props.onSortByChange(value);
                }
              }
              style={{width: 110}}
              menuItemStyle={{fontSize: 12}}
              underlineStyle={{display: 'none'}}
            >
              <MenuItem value={'First'} primaryText="FIRST"/>
              <MenuItem value={'Last'} primaryText="LAST"/>
              <MenuItem value={'Company'} primaryText="COMPANY"/>
            </SelectField>
          </ToolbarGroup>
          <ToolbarGroup >
            <MediaQuery query='(max-device-width: 989px)'>
              <IconButton
                touch={true}
                onTouchTap={(e) => {
                  e.preventDefault();
                  this.props.onToggleShowRecommendation();
                }}
                iconClassName="icon icon-custom-people"
                iconStyle={{color: this.props.showRecommendation ? colors.orange1 : ''}}
              >
              </IconButton>
            </MediaQuery>
            <IconButton
              id="filterButton"
              touch={true}
              onTouchTap={(e) => {
                e.preventDefault();
                this.props.onTapFilterPanel();
              }}
              iconClassName="icon icon-basic-mixer2"
              iconStyle={{color: this.props.showFilterPanel ? colors.orange1 : ''}}
            >
            </IconButton>
            <IconButton
              touch={true}
              onTouchTap={(e) => {
                e.preventDefault();
                this.props.onTapViewMode();
              }}
              iconClassName={this.props.viewMode === 'list' ? "icon icon-arrows-squares" : "icon icon-arrows-hamburger1"}
            >
            </IconButton>
          </ToolbarGroup>
        </Toolbar>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    showFilterPanel: state.panels.showFilterPanel
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

SortBar = connect(mapStateToProps, mapDispatchToProps)(SortBar)

export default SortBar;
