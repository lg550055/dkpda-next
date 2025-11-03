export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      © {currentYear} DKPDA. All rights reserved.
    </footer>
  );
}
