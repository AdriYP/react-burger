import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useParams } from 'react-router-dom';

import { ModalOverlay } from '../modal-overlay/modal-overlay';

import type React from 'react';

import styles from './modal.module.css';

export type TModalProps = {
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
};

type TRouteParams = {
  number?: string;
};

export const Modal = ({
  title,
  children,
  onClose,
}: TModalProps): React.ReactElement | null => {
  useEffect((): void | (() => void) => {
    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    return (): void => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const location = useLocation();
  const { number } = useParams<TRouteParams>();

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  const stopClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation();
  };

  const pathname = location.pathname;
  const isOrderRoute =
    !!number &&
    (pathname.startsWith('/feed/') || pathname.startsWith('/profile/orders/'));

  let headerContent: React.ReactNode = null;

  if (isOrderRoute && number) {
    const padded = Number(number).toString().padStart(6, '0');
    headerContent = (
      <p className={`${styles.orderNumber} text text_type_digits-default`}>#{padded}</p>
    );
  } else if (title) {
    headerContent = <h2 className="text text_type_main-large">{title}</h2>;
  }

  return createPortal(
    <>
      <ModalOverlay onClose={onClose} />

      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        onClick={stopClick}
        data-testid="modal" // Cypress
      >
        <div className={styles.content}>
          <div className={`${styles.header} pl-10 pr-10 pt-10`}>
            {headerContent}

            <button
              type="button"
              onClick={onClose}
              className={styles.close}
              aria-label="Закрыть"
              data-testid="modal-close" // Cypress
            >
              <CloseIcon type="primary" />
            </button>
          </div>

          <div>{children}</div>
        </div>
      </div>
    </>,
    modalRoot
  );
};
