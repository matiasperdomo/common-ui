import React, { useState, useRef } from 'react';
import { Nav, NavDropdown } from 'react-bootstrap';
import styles from './Header.module.css';

const CLOSE_DELAY = 150; // ms (el resto lo cubre la transición CSS)

/**
 * Menu presentacional
 * items: [{ id, title, url, children: [...] }]
 */
export default function Menu({ items = [], isLgUp = false }) {
  const [openId, setOpenId] = useState(null);
  const closeTimer = useRef(null);

  const handleMouseEnter = (id) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpenId(id);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => {
      setOpenId(null);
    }, CLOSE_DELAY);
  };

  return (
    <Nav className="me-auto">
      {items.map((item) => {
        const hasChildren =
          Array.isArray(item.children) && item.children.length > 0;

        if (hasChildren) {
          const isOpen = openId === item.id;

          return (
            <NavDropdown
              key={item.id}
              title={item.title || ''}
              className={styles['menu-dropdown']}
              show={isOpen}
              onMouseEnter={() => handleMouseEnter(item.id)}
              onMouseLeave={handleMouseLeave}
            >
              {item.children.map((child) => (
                <NavDropdown.Item
                  key={child.id}
                  href={child.url || '#'}
                  className={styles['menu-item']}
                >
                  {child.title || ''}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          );
        }

        return (
          <Nav.Item key={item.id}>
            <Nav.Link
              href={item.url || '#'}
              className={styles['menu-link']}
            >
              {item.title || ''}
            </Nav.Link>
          </Nav.Item>
        );
      })}
    </Nav>
  );
}