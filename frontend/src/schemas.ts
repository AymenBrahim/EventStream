export type User = { id: string; username: string; email: string };

export type UserInfo = User & {
  access_token: string;
};

export type UserAuthResponse = UserInfo & {};

export type AuthStore = {
  user?: UserInfo;
  signin: (data: UserInfo) => void;
  signout: () => void;
};

export type Event = {
  starts_at: string;
  location: string;
  duration: number;
  updated_at: string;
  title: string;
  organizer: string;
  id: string;
  created_at: string;
  joiners: UserInfo[];
};

export type WebsocketPayload = {
  user: UserInfo;
  eventId: string;
  action: "join" | "cancel";
};
