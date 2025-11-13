import PropTypes from 'prop-types';

import styles from './modal-overlay.module.css';

export const ModalOverlay = ({ onClose }) => {
  return <div className={styles.overlay} onClick={onClose} aria-hidden="true" />;
};

ModalOverlay.propTypes = {
  onClose: PropTypes.func.isRequired,
};
