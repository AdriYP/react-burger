import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay } from '../modal-overlay/modal-overlay';

import styles from './modal.module.css';

export const Modal = ({ title, children, onClose }) => {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return createPortal(
    <>
      <ModalOverlay onClose={onClose} />
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.content}>
          <div className={`${styles.header} pl-10 pr-10 pt-10`}>
            <h2 className="text text_type_main-large">{title ?? ''}</h2>
            <CloseIcon
              type="primary"
              className={styles.close}
              role="button"
              onClick={onClose}
            />
          </div>

          <div>{children}</div>
        </div>
      </div>
    </>,
    document.getElementById('modal-root')
  );
};

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
};
