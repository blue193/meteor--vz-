import React from 'react';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';

import Api from 'lib/api';
import Session from 'lib/session';
import processImage from 'lib/processImage';
import {renderIf} from 'lib/renderThunk';

import styles from './index.css';
import Loader from '_components/Loader';
import Button from '_components/Button';
import {colors} from 'styles/colors';

export default class extends React.Component {
  state = {
    loaded: false,
    profile: null,
  };

  componentDidMount() {
    Api
      .getProfile(this.props.id ? {userId: this.props.id} : {})
      .then(profile => {
        const fullProfile = this.props.submit ? {
            ...profile,
            ...Session.loadState(Session.PROFILE_STATE),
          } : profile;

        this.setState({
          loaded: true,
          profile: fullProfile,
        });

        const retryAttempts = Session.loadState(Session.PROFILE_COMPLETED).count || false;

        if (retryAttempts && retryAttempts < 3) {
          this.props.submit(fullProfile);
        } else if (this.props.personLoaded) {
          this.props.personLoaded();
        }
      });
  }

  update = prop => (e, val) => {
    const profile = {...this.state.profile, [prop]: val};
    this.setState({profile});
    Session.saveState(Session.PROFILE_STATE, profile)
  }

  updateImage = e => {
    e.preventDefault();
    const file = e.target.files[0];

    Promise.resolve(file)
      .then(processImage)
      .then(Api.uploadProfileImage)
      .then(({imageUrl}) => {
        this.update('image')(undefined, imageUrl);
      });
  }

  submit = () => {
    this.props.submit(this.state.profile);
  }

  render() {
    if (!this.state.loaded) {
      return <Loader />;
    }

    const {firstName, lastName, image} = this.state.profile;
    const canSubmit = Boolean(firstName) && Boolean(lastName);
    const {submit, update} = this;

    const tfProps = (type, alwaysDisabled) => {
      const partialProps = {
        fullWidth: true,
        value: this.state.profile[type] || ''
      };

      // Determine if object
      if (typeof partialProps.value === 'object' || partialProps.value instanceof Object) {
        var stringVersion = '';

        Object.getOwnPropertyNames(partialProps.value).sort().forEach(function(val, idx, array) {
          stringVersion += partialProps.value[val];

          if (idx < array.length - 1) {
            stringVersion += '\n';
          }
        });

        partialProps.value = stringVersion;
      }

      if (!this.props.submit || alwaysDisabled) {
        const disabled = this.props.submit && alwaysDisabled;
        return {
          ...partialProps,
          readOnly: !disabled,
          underlineFocusStyle: {
            borderColor: 'transparent',
          },
          disabled,
        }
      } else {
        return {
          ...partialProps,
          onChange: update(type),
        }
      }
    }

    return (
      <form>
        <div className={styles.container}>
          {renderIf(!this.props.hideAvatar)(() => (
            <div style={{
              padding: 50,
              display: 'flex',
              flexDirection: 'column',
              flexWrap: 'wrap',
              borderRight: 'solid 1px',
              borderColor: colors.grey7,
              alignItems: 'center'
            }}>
              <div
                style={{
                  padding: 5,
                  margin: 15,
                  border: 'solid 3px',
                  borderColor: colors.orange0,
                  borderRadius: '50%',
                  lineHeight: 0,
                  width: 176,
                  height: 176
                }}>
                <Avatar size={160} src={image}/>
              </div>
              <input type="file" accept="image/*" onChange={this.updateImage}
                     style={{color: colors.orange1, fontSize: 14, fontWeight: 900, width: 210}}/>
              <p style={{
                fontSize: 14,
                fontWeight: 300,
                fontStyle: 'italic',
                color: colors.grey8,
                textAlign: 'center',
                maxWidth: 200
              }}>Images can be no more than 5MB in size, and must be a web friendly format including .JPG or .PNGs.</p>
            </div>
          ))}
          <div style={{padding: 50, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around'}}>
            <TextField {...tfProps('firstName')} hintText="John / Jane" floatingLabelText="First Name" />
            <TextField {...tfProps('lastName')} hintText="Doe" floatingLabelText="Last Name" />
            <TextField {...tfProps('title')} hintText="CEO" floatingLabelText="Title" />
            <TextField {...tfProps('company')} hintText="Facebook" floatingLabelText="Company" />
            <TextField {...tfProps('address')} hintText="1337 Main Street" floatingLabelText="Address" multiLine={true} />
            {renderIf(this.props.submit)(() => (
              <TextField {...tfProps('email', true)} hintText="you@company.com" floatingLabelText="Email" />
            ))}
            <TextField {...tfProps('website')} hintText="you.com" floatingLabelText="Website" />
            <TextField {...tfProps('phone')} hintText="(222) 444 - 5555" floatingLabelText="Phone" />
            {renderIf(this.props.submit)(() => (
              <div style={{width: '100%', textAlign: 'right', padding: 20}}>
                <Button
                  primary
                  disabled={!canSubmit}
                  label={this.props.buttonText}
                  onClick={submit}
                  />
              </div>
            ))}
          </div>
        </div>
      </form>
    )
  }
}
