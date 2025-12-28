import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay } from '../modal-overlay/modal-overlay';

import type React from 'react';

import styles from './modal.module.css';

type TModalProps = {
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
};

export const Modal = ({
  title,
  children,
  onClose,
}: TModalProps): React.ReactElement | null => {
  useEffect((): (() => void) => {
    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    return (): void => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  const stopClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation();
  };

  return createPortal(
    <>
      <ModalOverlay onClose={onClose} />

      <div className={styles.modal} role="dialog" aria-modal="true" onClick={stopClick}>
        <div className={styles.content}>
          <div className={`${styles.header} pl-10 pr-10 pt-10`}>
            <h2 className="text text_type_main-large">{title ?? ''}</h2>

            <button
              type="button"
              onClick={onClose}
              className={styles.close}
              aria-label="Закрыть"
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
