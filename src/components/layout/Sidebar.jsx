
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.startsWith(path) ? 'active' : '';
  };

  return (
    <aside className="sidebar">
      <nav>
        <ul className="sidebar-nav">
          <li>
            <Link to="/peminjaman" className={isActive('/peminjaman')}>
              📝 Peminjaman
            </Link>
          </li>
          <li>
            <Link to="/ruangan" className={isActive('/ruangan')}>
              🏛️ Ruangan
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;