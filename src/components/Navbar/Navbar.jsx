import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Formulario', path: '/FormularioPage' },
    { label: 'Recibo', path: '/ReciboPage' },
    { label: 'Serviços', path: '/ServicosPage' }, // ajuste conforme o seu real path
    { label: 'Editar valores', path: '/EditarValoresPage' },
    { label: 'Orçamentos', path: '/OrcamentosPage' },
    { label: 'Cliente', path: '/ClientePage' },
    { label: 'Sair', path: '/' }
  ];

  return (
    <div className={styles.navbar}>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={`${styles.button} ${location.pathname === item.path ? styles.active : ''}`}
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  );
};

export default Navbar;
