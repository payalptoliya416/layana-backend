import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md text-center">
        {/* 404 */}
        <h1 className="
          font-extrabold text-primary leading-none
          text-[72px]
          sm:text-[90px]
          md:text-[110px]
          mb-4
        ">
          404
        </h1>

        {/* Heading */}
        <h2 className="
          font-semibold
          text-lg
          sm:text-xl
          md:text-2xl
          mb-2
        ">
          Page not found
        </h2>

        {/* Description */}
        <p className="
          text-muted-foreground
          text-sm
          sm:text-base
          mb-8
        ">
          Sorry, the page you are looking for doesn’t exist or has been moved.
        </p>

        {/* CTA Button */}
        <Link
          to="/"
          className="
            inline-flex items-center justify-center
            rounded-lg bg-primary
            px-6 py-3
            text-sm sm:text-base
            font-medium text-white
            transition hover:bg-primary/90
          "
        >
          Go back home
        </Link>

        {/* Requested Path (dev friendly) */}
        <p className="
          mt-6
          text-xs
          sm:text-sm
          text-muted-foreground
          break-all
        ">
          Requested URL:{" "}
          <span className="font-medium">{location.pathname}</span>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
