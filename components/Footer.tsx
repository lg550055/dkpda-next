export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      © Dikipedia {currentYear}. All rights reserved. (Not really)
    </footer>
  );
}
