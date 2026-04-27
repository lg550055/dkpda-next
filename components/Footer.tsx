export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <span className="footer-logo">Dikipedia</span>
        <p className="footer-tagline">
          All events depicted are fictional, which is unfortunate because they&rsquo;re all plausible.
        </p>
        <p className="footer-copy">&copy; {year} Dikipedia. All rights not reserved.</p>
      </div>
    </footer>
  );
}
