import { companyContent } from '../data/companyContent';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <a className="footer-brand" href="#home">
          <img src="/logo.jpg" width="44" height="44" alt="" />
          <span>{companyContent.footer.legal}</span>
        </a>
        <p className="footer-contact">
          <a href={companyContent.contact.phoneHref}>{companyContent.contact.phoneLabel}</a>
          <a href={companyContent.contact.emailHref}>{companyContent.contact.emailLabel}</a>
        </p>
        <p>
          © {year} {companyContent.footer.legal}
        </p>
      </div>
      <p className="site-footer__credit">{companyContent.footer.mediaCredit}</p>
    </footer>
  );
}
