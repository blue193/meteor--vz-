import React from 'react';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';

import Api from 'lib/api';
import {colors} from 'styles/colors';

export default class extends React.Component {
  state = {
    profile: null,
  };

  componentDidMount() {
    Api
      .getProfile({})
      .then(profile => {
        this.setState({
          profile: profile
        });
      });
  }

  render() {
    if (!this.state.profile) {
      return null;
    }
    const {firstName, lastName, image} = this.state.profile;
    return (
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          borderWidth: '1px 0',
          borderStyle: 'solid',
          borderColor: colors.grey2,
          width: '100%'
        }}>
        <div
          style={{
            padding: 3,
            margin: 15,
            border: 'solid 2px',
            borderColor: colors.orange0,
            borderRadius: '50%',
            lineHeight: 0,
            width: 72,
            height: 72
          }}>
          <Avatar size={62} src={image}/>

          <div
            style={{
              position: 'absolute',
              left: 65,
              top: 65,
              color: colors.orange0,
              backgroundColor: colors.orange0,
              borderRadius: '50%',
              border: 'solid 2px',
              borderColor: colors.orange0
            }}>
            <FontIcon className="material-icons"
                      style={{color: colors.grey2, transition: 'none', fontSize: '16px'}}>chevron_right</FontIcon>
          </div>
          <div
            style={{position: 'absolute', left: 105, top: 40, color: colors.orange0, fontSize: 20, fontWeight: 300}}>
            {firstName + ' ' + lastName}
          </div>
          <div
            style={{position: 'absolute', left: 105, top: 65, color: colors.orange0, fontSize: 14, fontWeight: 300}}>
            Admin
          </div>
        </div>
      </div>
    );
  }
}
