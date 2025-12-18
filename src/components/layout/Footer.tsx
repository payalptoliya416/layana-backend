export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="text-center shrink-0 mx-auto mt-3 ">
      <p className="text-sm text-muted-foreground m-0">
        Copyright © {currentYear} Layana. All rights reserved.
      </p>
    </footer>
  );
}
