import successIcon from '../../images/order.png';

import styles from './order-details.module.css';

export const OrderDetails = () => {
  // Генерация 6-значного идентификатора
  const orderId = String(Math.floor(Math.random() * 1_000_000)).padStart(6, '0');

  return (
    <div className={`${styles.wrapper} pb-30 pt-4`}>
      <p className={`${styles.digitGlow} text text_type_digits-large pb-8`}>{orderId}</p>

      <p className="text text_type_main-medium pb-15">идентификатор заказа</p>

      <div className={`${styles.badge} pb-15`}>
        <img
          src={successIcon}
          alt=""
          className={styles.badgeImg}
          width={120}
          height={120}
        />
      </div>

      <p className="text text_type_main-default pb-2">Ваш заказ начали готовить</p>
      <p className={`${styles.secondary} text text_type_main-default`}>
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
};
