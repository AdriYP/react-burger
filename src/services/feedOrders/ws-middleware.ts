import { socketMiddleware } from '../middleware/socket-middleware';
import { isOrdersPayload } from '../middleware/ws-guards';
import { feedConnect, feedDisconnect } from './actions';
import { wsClose, wsError, wsMessage, wsOpen } from './slice';

export const ordersMiddleware = socketMiddleware({
  connect: feedConnect,
  disconnect: feedDisconnect,
  onClose: wsClose,
  onOpen: wsOpen,
  onError: wsError,
  onMessage: wsMessage,
  isMessage: isOrdersPayload,
});
