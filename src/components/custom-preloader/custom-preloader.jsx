import { Preloader } from '@krgaa/react-developer-burger-ui-components';

import styles from './custom-preloader.module.css';

export const CenteredPreloader = () => {
  return (
    <div className={styles.centered}>
      <Preloader />
    </div>
  );
};
