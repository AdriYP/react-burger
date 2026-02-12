import {
  CREATE_DATA_API,
  ORDER_ERROR,
  ORDER_REQUEST,
  ORDER_SUCCESS,
  type TOrderActions,
  type TCreateOrderData,
  type TOrderSuccessPayload,
} from './actions';

export type TOrderState = {
  dataSend: TCreateOrderData | null;
  dataReceived: TOrderSuccessPayload | null;
  loading: boolean;
  error: string | null;
};

export const initialState: TOrderState = {
  dataSend: null,
  dataReceived: null,
  loading: false,
  error: null,
};

export const orderReducer = (
  state: TOrderState = initialState,
  action: TOrderActions
): TOrderState => {
  switch (action.type) {
    case CREATE_DATA_API:
      return { ...state, dataSend: action.payload };

    case ORDER_REQUEST:
      return { ...state, loading: true, error: null };

    case ORDER_SUCCESS:
      return { ...state, loading: false, dataReceived: action.payload, error: null };

    case ORDER_ERROR:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
