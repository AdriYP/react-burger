import { CREATE_DATA_API, ORDER_ERROR, ORDER_REQUEST, ORDER_SUCCESS } from './actions';

const initialState = {
  dataSend: null,
  dataReceived: null,
  loading: false,
  error: null,
};

export const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_DATA_API:
      return {
        ...state,
        dataSend: action.payload,
      };

    case ORDER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        dataReceived: action.payload,
        error: null,
      };

    case ORDER_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
