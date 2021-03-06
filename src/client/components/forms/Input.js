/* globals google, document */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export const Input = ({
  label,
  value,
  name,
  type,
  placeholder,
  handleChange,
  id,
}) => (
  <div className="form-group">
    {label && (
      <label htmlFor={id || name}>
        { label }
      </label>
    )}
    <input
      className="form-control"
      value={value}
      name={name}
      type={type}
      placeholder={placeholder}
      onChange={handleChange}
      id={id || name}
    />
  </div>
);

Input.defaultProps = {
  label: '',
  placeholder: '',
  id: '',
};

Input.propTypes = {
  label: PropTypes.string,
  value: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  id: PropTypes.string,
};

export class InputLocation extends Component {
  constructor(props) {
    super(props);

    this.initAutocomplete = this.initAutocomplete.bind(this);
    this.waitForGoogle = this.waitForGoogle.bind(this);
    this.handlePlaceChange = this.handlePlaceChange.bind(this);
  }

  componentDidMount() {
    this.waitForGoogle();
  }

  waitForGoogle() {
    if (typeof google !== 'undefined') {
      this.initAutocomplete();
    } else {
      // Check again if google is defined
      setTimeout(this.waitForGoogle, 125);
    }
  }

  handlePlaceChange(autocomplete) {
    const place = autocomplete.getPlace();

    if (
      !(
        place
        && place.geometry
        && place.geometry.location
        && place.geometry.location.lat
        && place.geometry.location.lng
      )
    ) {
      return;
    }

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const { name } = place;
    const { callback } = this.props;

    callback({
      lat,
      lng,
      name,
    });
  }

  initAutocomplete() {
    const location = document.getElementById('location');

    const options = {
      componentRestrictions: { country: 'us' },
    };

    const autocomplete = new google.maps.places.Autocomplete(location, options);

    google.maps.event.addListener(autocomplete, 'place_changed', () => this.handlePlaceChange(autocomplete));
  }

  render() {
    const {
      label,
      value,
      name,
      type,
      placeholder,
      handleChange,
    } = this.props;

    return (
      <Input
        label={label}
        value={value}
        name={name}
        type={type}
        placeholder={placeholder}
        handleChange={handleChange}
        id="location"
      />
    );
  }
}

InputLocation.defaultProps = {
  label: '',
  placeholder: '',
};

InputLocation.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
};
