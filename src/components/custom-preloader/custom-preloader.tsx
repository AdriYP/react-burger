import { Preloader } from '@krgaa/react-developer-burger-ui-components';

import type React from 'react';

import styles from './custom-preloader.module.css';

export const CenteredPreloader = (): React.ReactElement => {
  return (
    <div className={styles.centered}>
      <Preloader />
    </div>
  );
};
