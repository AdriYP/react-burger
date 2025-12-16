import {
  AUTH_REQUEST,
  AUTH_SUCCESS,
  AUTH_ERROR,
  AUTH_LOGOUT,
  AUTH_CHECKED,
} from './actions';

const initialState = {
  user: null,
  loading: false,
  error: null,

  isAuthChecked: false,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        user: action.payload,
      };

    case AUTH_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case AUTH_LOGOUT:
      return {
        ...state,
        loading: false,
        error: null,
        user: null,
      };

    case AUTH_CHECKED:
      return {
        ...state,
        isAuthChecked: true,
      };

    default:
      return state;
  }
};
