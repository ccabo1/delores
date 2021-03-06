import axios from 'axios';

import {
  GET_HOSPITALS_REJECTED,
  GET_HOSPITALS_FULFILLED,
  GET_HOSPITALS_REQUESTED,
} from './actionTypes';

export function getHospitals() {
  return async (dispatch) => {
    dispatch({
      type: GET_HOSPITALS_REQUESTED,
    });

    try {
      axios.get('/api/hospitals')
        .then((res) => {
          dispatch({
            type: GET_HOSPITALS_FULFILLED,
            hospitals: res.data.hospitals,
          });
        });
    } catch (error) {
      dispatch({
        type: GET_HOSPITALS_REJECTED,
        error: error.message || 'There was an error pulling studyspaces data',
      });
    }
  };
}
