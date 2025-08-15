import { useLocation } from 'react-router-dom';
import { Navbar } from '@clear/ui';
import { Logo } from './Logo';

export function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const links = [
    { href: '/', label: 'Feed', active: isActive('/') },
    { href: '/upload', label: 'Upload', active: isActive('/upload') },
  ];

  return (
    <Navbar
      logo={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Logo />
        </div>
      }
      links={links}
      actions={null}
    />
  );
}
