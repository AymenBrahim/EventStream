import useAuthStore from "@/hooks/use-auth-store";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Button } from "./ui/button";
export default function Header() {
  const location = useLocation();
  const { pathname: initialPathname } = location;

  const pathname = initialPathname.endsWith("/")
    ? initialPathname.substring(0, initialPathname.length - 1)
    : initialPathname;

  const user = useAuthStore(({ user }) => user);
  const signout = useAuthStore(({ signout }) => signout);
  const navigate = useNavigate();

  if (pathname === "/signin" || pathname === "/signup") {
    return null;
  }
  return (
    <header className="p-2 flex justify-between">
      <Link to="/" className="[&.active]:font-bold">
        Events
      </Link>
      <div className="flex x-5">
        <h1 className="mr-10">{user?.username}</h1>
        <Button
          onClick={() => {
            signout();
            navigate({ to: "/signin" });
          }}
        >
          Signout
        </Button>
      </div>
    </header>
  );
}
