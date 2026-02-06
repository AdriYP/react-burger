import { socketMiddleware } from '../middleware/socket-middleware';
import { isOrdersPayload } from '../middleware/ws-guards';
import { profileConnect, profileDisconnect } from './actions';
import { wsClose, wsError, wsMessage, wsOpen } from './slice';

export const userOrdersMiddleware = socketMiddleware(
  {
    connect: profileConnect,
    disconnect: profileDisconnect,
    onClose: wsClose,
    onOpen: wsOpen,
    onError: wsError,
    onMessage: wsMessage,
    isMessage: isOrdersPayload,
  },
  true
);
