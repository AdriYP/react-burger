import ElectricBorder from '@/components/electric-border/electric-border';

import type React from 'react';

import styles from './not-found.module.css';

export const NotFoundPage = (): React.ReactElement => {
  return (
    <div className={`${styles.wrapper} mt-30`}>
      <ElectricBorder
        color="#7df9ff"
        speed={1}
        chaos={0.5}
        thickness={2}
        style={{ borderRadius: 16 }}
      >
        <div className="pl-10 pr-10 pt-10 pb-10">
          <h1 className="text text_type_main-large pb-10">404 - Страница не найдена</h1>
          <p className="text text_type_main-default">
            Извините, запрашиваемая страница не существует.
          </p>
        </div>
      </ElectricBorder>
    </div>
  );
};
