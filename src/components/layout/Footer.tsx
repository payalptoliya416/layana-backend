export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-6 text-center">
      <p className="text-sm text-muted-foreground">
        Copyright © {currentYear} Layana. All rights reserved.
      </p>
    </footer>
  );
}
