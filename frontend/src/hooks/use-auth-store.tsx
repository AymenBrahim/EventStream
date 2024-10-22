import createClient from "@/lib/client";
import { AuthStore } from "@/schemas";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAuthStore = create(
  persist<AuthStore>(
    (set) => ({
      ...getInitialDatafromSessionStorage(),
      signin: (user) => {
        set({ user });
      },
      signout: () => {
        set({ user: undefined });
      },
    }),
    {
      name: "event-stream-jwt", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

function getInitialDatafromSessionStorage() {
  const store = sessionStorage.getItem("event-stream-jwt");
  if (!store) {
    return undefined;
  }

  try {
    const parsedStore = JSON.parse(store) as AuthStore;
    const { user } = parsedStore;
    createClient(user?.access_token);

    return { user, createClient };
  } catch (e) {
    return undefined;
  }
}

export default useAuthStore;
