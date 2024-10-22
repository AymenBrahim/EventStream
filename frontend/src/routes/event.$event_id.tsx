import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useClient from "@/hooks/use-client";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFileRoute,
  useLocation,
  useParams,
} from "@tanstack/react-router";
import type { Event, UserInfo, WebsocketPayload } from "@/schemas";
import { formatDate, minutesToTime } from "@/lib/utils";
import useAuthStore from "@/hooks/use-auth-store";
import useWebSocket from "@/hooks/use-web-socket";

export const Route = createFileRoute("/event/$event_id")({
  component: EventDetailPage,
});

function EventDetailPage() {
  const { event_id } = useParams({ strict: false });
  const client = useClient();
  const location = useLocation();
  const user = useAuthStore(({ user }) => user)!;
  const userId = user.id;
  const queryClient = useQueryClient();

  function addUserToEventList(user: UserInfo) {
    queryClient.setQueryData([event_id], (oldEvent: Event) => {
      return { ...oldEvent, joiners: [...oldEvent.joiners, user] };
    });
  }
  function removeUserFromEventList(user: UserInfo) {
    queryClient.setQueryData([event_id], (oldEvent: Event) => {
      return {
        ...oldEvent,
        joiners: oldEvent.joiners.filter(({ id }) => id !== user.id),
      };
    });
  }

  const [isConnected, wsSend] = useWebSocket({
    onMessage: (e) => {
      const payload = JSON.parse(
        e.data as unknown as string
      ) as WebsocketPayload;
      console.log(payload);
      if (payload.user.id === userId || payload.eventId !== event_id) {
        return;
      }

      if (payload.action === "join") {
        return addUserToEventList(payload.user);
      }
      removeUserFromEventList(payload.user);
    },
  });

  const { data: event } = useQuery<Event>({
    queryKey: [event_id ?? ""],
    queryFn: async () => {
      return (await client.get(`/event/${event_id}`)).data;
    },
  });

  const link = window.location.host + location.pathname;
  console.log(user);
  const joinMutation = useMutation({
    mutationFn: async () => {
      const resp = await client.post(`/event/${event_id}/join`);
      wsSend(JSON.stringify({ user, eventId: event_id, action: "join" }));
    },
    mutationKey: ["join"],
    onSuccess: () => addUserToEventList(user),
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      await client.post(`/event/${event_id}/cancel`);
      wsSend(JSON.stringify({ user, eventId: event_id, action: "cancel" }));
    },
    mutationKey: ["cancel"],
    onSuccess: () => removeUserFromEventList(user),
  });

  if (!event) {
    return null;
  }

  return (
    <div className="h-full grow flex-column">
      <div className="h-full grow p-5 flex-column">
        <Card className="bg-slate-950 p-4 rounded border-[1px] border-opacity-50 border-slate-200 w-full h-full grow">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-6">Event Details</h2>
            <div className="flex justify-end">
              {(!event.joiners.some((joiner) => joiner.id === userId) && (
                <Button
                  variant="secondary"
                  onClick={async () => {
                    await joinMutation.mutateAsync();
                  }}
                >
                  Join Event
                </Button>
              )) || (
                <Button
                  variant="destructive"
                  onClick={async () => {
                    await cancelMutation.mutateAsync();
                  }}
                >
                  Cancel Joining Event
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GridItem title={"Title"} value={event.title} />
              <GridItem title={"Location"} value={event.location} />
              <GridItem
                title={"Starts At"}
                value={formatDate(event.starts_at)}
              />
              <GridItem
                title={"Duration"}
                value={`${minutesToTime(event.duration)}`}
              />
              <GridItem title={"Organizer"} value={event.organizer} />
              <GridItem
                title={"Number of participants"}
                value={event.joiners.length + ""}
              />
            </div>

            <label className="block text-sm font-medium mt-5">
              Share This Event
            </label>
            <div className="flex space-x-2">
              <Input value={link} readOnly />
              <Button onClick={() => navigator.clipboard.writeText(link)}>
                Copy Link
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              People that will join:
            </label>
            <ul className="space-y-2">
              {event.joiners.map((user) => (
                <li
                  key={user.email}
                  className="flex justify-between items-center p-2 bg-gray-700 rounded-md"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>{user.username[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{user.username}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}

type GridItemProps = {
  title: string;
  value: string;
};
const GridItem = ({ title, value }: GridItemProps) => (
  <div>
    <h3 className="text-sm font-medium">{title}</h3>
    <p className="mt-1 text-lg font-semibold">{value}</p>
  </div>
);
