import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
  Logo,
} from '@krgaa/react-developer-burger-ui-components';
import { NavLink } from 'react-router-dom';

import styles from './app-header.module.css';

const linkClass = ({ isActive }) =>
  `${styles.link} ${isActive ? styles.link_active : ''}`;

export const AppHeader = () => {
  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink to="/" end className={linkClass}>
            {({ isActive }) => (
              <>
                <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
                <p className="text text_type_main-default ml-2">Конструктор</p>
              </>
            )}
          </NavLink>

          <NavLink to="/feed" className={(args) => `${linkClass(args)} ml-10`}>
            {({ isActive }) => (
              <>
                <ListIcon type={isActive ? 'primary' : 'secondary'} />
                <p className="text text_type_main-default ml-2">Лента заказов</p>
              </>
            )}
          </NavLink>
        </div>
        <div className={styles.logo}>
          <NavLink to="/" aria-label="На главную">
            <Logo />
          </NavLink>
        </div>

        <div className={styles.link_position_last}>
          <NavLink to="/profile" className={(args) => `${linkClass(args)} ml-10`}>
            {({ isActive }) => (
              <>
                <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
                <p className="text text_type_main-default ml-2">Личный кабинет</p>
              </>
            )}
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
