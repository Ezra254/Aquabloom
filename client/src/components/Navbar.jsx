import { useEffect, useState } from 'react';
import { companyContent } from '../data/companyContent';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <a className="brand" href="#home" onClick={() => setOpen(false)}>
          <img
            className="brand__mark"
            src="/logo.jpg"
            width="44"
            height="44"
            alt=""
          />
          <span className="brand__text">
            <strong>Aquabloom</strong>
            <span>Ventures Limited</span>
          </span>
        </a>

        <button
          className="nav-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <span />
          <span />
          <span />
        </button>

        <nav id="site-nav" className={`nav-links ${open ? 'is-open' : ''}`}>
          {companyContent.nav.map((item) => (
            <a key={item.id} href={`#${item.id}`} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
