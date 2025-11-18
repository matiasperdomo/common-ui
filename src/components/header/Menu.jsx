import React from 'react';
import { Nav, NavDropdown } from 'react-bootstrap';
import styles from './Header.module.css';

/**
 * Menu presentacional
 * items: [{ id, title, url, children: [...] }]
 */
export default function Menu({ items = [] }) {
  return (
    <Nav className="me-auto">
      {items.map((item) => {
        const hasChildren = Array.isArray(item.children) && item.children.length > 0;

        if (hasChildren) {
          return (
            <NavDropdown
              key={item.id}
              title={item.title || ''}
              className={styles['menu-dropdown']}
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
          <Nav.Link
            key={item.id}
            href={item.url || '#'}
            className={styles['menu-link']}
          >
            {item.title || ''}
          </Nav.Link>
        );
      })}
    </Nav>
  );
}
