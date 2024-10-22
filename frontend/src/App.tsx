import { routeTree } from "./routeTree.gen";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useAuthStore from "./hooks/use-auth-store.tsx";

// Create a new router instance
const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  context: {
    signin: undefined!,
    signout: undefined!,
    user: undefined!,
  },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const auth = useAuthStore();

  // const useStore = createStore<AuthStore>((set) => {});
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={auth} />
    </QueryClientProvider>
  );
}

export default App;
