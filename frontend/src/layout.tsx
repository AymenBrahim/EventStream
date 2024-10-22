import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import Header from "./components/header";

export default function Layout() {
  return (
    <>
      <Header />
      <main className="grow flex flex-col">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </>
  );
}
