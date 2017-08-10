import React from 'react';
import {connect} from 'react-redux';

import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { List, ListItem, makeSelectable } from 'material-ui/List';

import auth from 'lib/auth';
import { renderIf } from 'lib/renderThunk';
import LoginUser from '_components/LoginUser';

import {cssStyles} from 'styles/overrides';
import {eventIcon, profileIcon, peopleIcon, requestIcon, scheduleIcon, exitIcon, rightIcon} from 'styles/icons';
import {colors} from 'styles/colors';


const SelectableList = makeSelectable(List);

let SideNavigation = class extends React.Component {

  static contextTypes = {
    router: React.PropTypes.any
  };

  state = {
    location: ""
  };

  componentDidMount() {
    this.setState({location: location.pathname});
  }

  render() {
    const props = this.props;
    const { router } = this.context;
    const selectedEvent =  props.events.find((e) => e.website === window.location.host);

    return (
      <Drawer open containerStyle={{backgroundColor: colors.grey5}}>
        <AppBar
            style={cssStyles.appBar.root}
            title={<img role="presentation"
                        src={props.eventSettings.logo}
                        style={cssStyles.appBar.title} />}
            showMenuIconButton={false}
        />
        {renderIf(false)(() => (
          <div>
            <label>Change Event:</label>
            <DropDownMenu
              maxHeight={300}
              value={selectedEvent.website}
              onChange={(e, i, v) => window.location = `http://${v}`}
            >
              {props.events.map((event) => (
                <MenuItem
                  value={event.website}
                  key={event.id}
                  primaryText={event.name}
                />
              ))}
            </DropDownMenu>
          </div>
        ))}
        <SelectableList
          selectedItemStyle={cssStyles.list.selectedItem}
          value={this.state.location}
          onChange={(e, path) => {
            e.preventDefault();
            if (path !== 'None') {
              router.push(path);
              this.setState({location: location.pathname})
            }
          }}
          style={{paddingTop:0}}>
          {renderIf(selectedEvent)(() => (
            <ListItem
              innerDivStyle={cssStyles.listItem.innerDiv}
              style={{opacity: props.disableSome ? 0.3 : 1, ...cssStyles.listItem.root}}
              primaryText={selectedEvent.name.toUpperCase()}
              value="None"
              leftIcon={eventIcon} />
          ))}
          <ListItem
            nestedListStyle={{padding: 0}}
            disabled={props.disableSome}
            innerDivStyle={cssStyles.listItem.innerDiv}
            style={{opacity: props.disableSome ? 0.3 : 1, ...cssStyles.listItem.root}}
            primaryText="PEOPLE" value="" leftIcon={peopleIcon}
            primaryTogglesNestedList={true}
            nestedItems={[
              <ListItem
                disabled={props.disableSome}
                innerDivStyle={cssStyles.listItem.innerDiv}
                style={{opacity: props.disableSome ? 0.3 : 1, ...cssStyles.listItem.root}}
                value="/"
                primaryText="ALL PEOPLE"
                leftIcon={rightIcon}/>,
              <ListItem
                disabled={props.disableSome}
                innerDivStyle={cssStyles.listItem.innerDiv}
                style={{opacity: props.disableSome ? 0.3 : 1, ...cssStyles.listItem.root}}
                value="/recommendations"
                primaryText="YOUR RECOMMENDATIONS"
                leftIcon={rightIcon}/>
            ]}/>
          <ListItem
            disabled={props.disableSome}
            innerDivStyle={cssStyles.listItem.innerDiv}
            style={{opacity: props.disableSome ? 0.3 : 1, ...cssStyles.listItem.root}}
            primaryText="REQUESTS"
            value="/requests"
            leftIcon={requestIcon} />
          {renderIf(true)(() => (
            <ListItem
              disabled={props.disableSome}
              innerDivStyle={cssStyles.listItem.innerDiv}
              style={{opacity: props.disableSome ? 0.3 : 1, ...cssStyles.listItem.root}}
              primaryText="SCHEDULE"
              value="/schedule"
              leftIcon={scheduleIcon} />
          ))}
          <ListItem
            disabled={props.disableSome}
            innerDivStyle={cssStyles.listItem.innerDiv}
            style={{opacity: props.disableSome ? 0.3 : 1, ...cssStyles.listItem.root}}
            primaryText="PROFILE"
            value="/profile"
            leftIcon={profileIcon} />
          <ListItem
            innerDivStyle={cssStyles.listItem.innerDiv}
            style={{opacity: props.disableSome ? 0.3 : 1, ...cssStyles.listItem.root}}
            primaryText="LOGOUT"
            value="None"
            leftIcon={exitIcon}
            onTouchTap={auth.logOut} />
        </SelectableList>
        <LoginUser />
      </Drawer>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    eventSettings: state.event.settings,
    events: state.event.events
  }
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

SideNavigation = connect(mapStateToProps, mapDispatchToProps)(SideNavigation);

export default SideNavigation;
