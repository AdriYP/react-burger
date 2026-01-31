import type React from 'react';

import styles from './modal-overlay.module.css';

type TModalOverlayProps = {
  onClose: () => void;
};

export const ModalOverlay = ({ onClose }: TModalOverlayProps): React.ReactElement => {
  return <div className={styles.overlay} onClick={onClose} aria-hidden="true" />;
};
