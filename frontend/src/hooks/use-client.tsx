import createClient from "@/lib/client";
import useAuthStore from "./use-auth-store";

export default function useClient() {
  const access_token = useAuthStore(({ user }) => user?.access_token);
  return createClient(access_token);
}
