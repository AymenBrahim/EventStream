import { redirect } from "@tanstack/react-router";
import { createRootRouteWithContext } from "@tanstack/react-router";
import Layout from "../layout";
import { AuthStore } from "@/schemas";
const publicRoutes = ["/signin", "/signup"];

export const Route = createRootRouteWithContext<AuthStore>()({
  component: Layout,
  /* beforeLoad: async ({ location, context }) => {
    console.log(context, location);
    const pathname = trimEnd(location.pathname);
    const isInPublicRoute = publicRoutes.includes(pathname);
    const isInUserRoute = !isInPublicRoute;

    const shouldAuthaunticate = !context.token && isInUserRoute;
    const shouldSeeProfile = context.token && isInPublicRoute;
    console.log(context.token, location.pathname, {
      shouldAuthaunticate,
      shouldSeeProfile,
      isInPublicRoute,
      isInUserRoute,
      pathname,
    });
    if (shouldAuthaunticate) {
      throw redirect({
        to: "/signin",
        search: {
          // Use the current location to power a redirect after login
          // (Do not use `router.state.resolvedLocation` as it can
          // potentially lag behind the actual current location)
          redirect: location.href,
        },
      });
    }
    if (shouldSeeProfile) {
      throw redirect({
        to: "/",
      });
    }
  }, */
});

const trimEnd = (pathname: string, access_token = "/") => {
  return pathname.endsWith(access_token)
    ? pathname.substring(0, pathname.length - 1)
    : pathname;
};
