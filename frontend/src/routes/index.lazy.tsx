import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useAuthStore from "@/hooks/use-auth-store";
import useClient from "@/hooks/use-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createLazyFileRoute } from "@tanstack/react-router";
import type { Event, UserInfo, WebsocketPayload } from "@/schemas";
import useWebSocket from "@/hooks/use-web-socket";
import { formatDate, minutesToTime } from "@/lib/utils";
export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const user = useAuthStore(({ user }) => user)!;
  const userId = user.id;

  const queryClient = useQueryClient();

  const client = useClient();

  const query = useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: async () => (await client.get("/event")).data,
  });

  function addUserToContext(user: UserInfo, eventId: string) {
    queryClient.setQueryData(["events"], (old: any) => {
      const events = old as Event[];

      const index = events.findIndex((obj) => obj.id == eventId);
      if (index === events.length - 1) {
        return events.slice(0, events.length - 1);
      }

      const event = events[index];
      const joiners = [...event.joiners, user];

      return [
        ...events.slice(0, index),
        { ...event, joiners },
        ...events.slice(index + 1),
      ];
    });
  }

  function removeUserFromContext(user: UserInfo, eventId: string) {
    queryClient.setQueryData(["events"], (old: any) => {
      const events = old as Event[];

      const index = events.findIndex((obj) => obj.id == eventId);
      if (index === events.length - 1) {
        return events.slice(0, events.length - 1);
      }

      const event = events[index];
      const joiners = event.joiners.filter(({ id }) => id !== user.id);
      return [
        ...events.slice(0, index),
        { ...event, joiners },
        ...events.slice(index + 1),
      ];
    });
  }

  const [isConnected, wsSend] = useWebSocket({
    onMessage: (e) => {
      const payload = JSON.parse(
        e.data as unknown as string
      ) as WebsocketPayload;
      console.log(payload);
      if (payload.user.id === userId) {
        return;
      }

      if (payload.action === "join") {
        return addUserToContext(payload.user, payload.eventId);
      }
      removeUserFromContext(payload.user, payload.eventId);
    },
  });

  const joinMutation = useMutation({
    mutationFn: async (id: string) => {
      await client.post(`/event/${id}/join`);
      wsSend(JSON.stringify({ user, eventId: id, action: "join" }));
    },
    mutationKey: ["join"],
    onSuccess: (data, eventId, context) => addUserToContext(user, eventId),
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      await client.post(`/event/${id}/cancel`);
      wsSend(JSON.stringify({ user, eventId: id, action: "cancel" }));
    },
    mutationKey: ["cancel"],
    onSuccess: (data, eventId, context) => {
      removeUserFromContext(user, eventId);
    },
  });

  const events = query.data;

  if (query.isLoading) {
    return "Loading";
  }

  if (events && !events.length) {
    return (
      <div className="m-5 flex-col bg-card grow h-full">
        <h1 className="mt-4 text-2xl text-muted-background text-center	">
          No Upcoming events
        </h1>
      </div>
    );
  }
  if (!events || query.isError) {
    return "Error";
  }

  return (
    <div className="m-5 flex-col bg-card grow h-full">
      <h1 className="mt-4 text-2xl text-muted-background text-center	">
        Upcoming events
      </h1>
      <ScrollArea className="h-full whitespace-nowrap rounded-md border">
        <Table className="h-[200px] ">
          <TableCaption>Current Events</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="">Event Name</TableHead>
              <TableHead>Event Loacation</TableHead>
              <TableHead>Event Begin Time</TableHead>
              <TableHead className="text-right w-[150px]">
                Event Duration
              </TableHead>
              <TableHead className="text-right w-[200px]">
                Participants
              </TableHead>
              <TableHead className="text-right w-[200px]">Action</TableHead>
              <TableHead className="text-right w-[80px]">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map(
              ({ id, starts_at, duration, joiners, location, title }) => {
                return (
                  <TableRow key={id}>
                    <TableCell className="font-medium f-width">
                      {title}
                    </TableCell>
                    <TableCell>{location}</TableCell>
                    <TableCell>{formatDate(starts_at)}</TableCell>
                    <TableCell className="text-right">
                      {minutesToTime(duration)}
                    </TableCell>
                    <TableCell className="text-right">
                      {joiners.length}
                    </TableCell>
                    <TableCell className="text-right">
                      {(!joiners.some((joiner) => joiner.id === userId) && (
                        <Button
                          variant="secondary"
                          onClick={async () => {
                            await joinMutation.mutateAsync(id);
                          }}
                        >
                          Join Event
                        </Button>
                      )) || (
                        <Button
                          variant="destructive"
                          onClick={async () => {
                            await cancelMutation.mutateAsync(id);
                          }}
                        >
                          Cancel Joining Event
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="text-right flex justify-end	">
                      <Link to={`/event/${id}`}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-menu"
                        >
                          <line x1="3" y1="12" x2="21" y2="12" />
                          <line x1="3" y1="6" x2="21" y2="6" />
                          <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
