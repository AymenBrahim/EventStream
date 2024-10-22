import FullScreenCard from "@/components/full-screen-card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useAuthStore from "@/hooks/use-auth-store";
import useClient from "@/hooks/use-client";
import { UserAuthResponse } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const Route = createFileRoute("/signin")({
  component: Signin,
});

const formSchema = z.object({
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  email: z
    .string()
    .min(8, {
      message: "Email must be at least 8 characters.",
    })
    .email("Please enter a valid Email"),
});

export function Signin() {
  const router = useRouter();
  const client = useClient();
  const signin = useAuthStore(({ signin }) => signin);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await client.post<UserAuthResponse>(
      "/signin",
      JSON.stringify(values)
    );
    if (res.status === 200) {
      signin(res.data);
      await router.navigate({
        to: "/",
      });
    }
  }

  return (
    <FullScreenCard>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe@gmail.com" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="****************"
                    {...field}
                    type="password"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-6 space-y-3">
            <Button className="mt-9 w-3/4 mx-auto flex" type="submit">
              Signin
            </Button>
            <FormDescription className="w-full text-center m-0">
              You don't have an account ?
            </FormDescription>
            <Link to={"/signup"}>
              <Button className="bg-teal-500 text-primary hover:text-teal-700  mt-3 w-3/4 mx-auto flex shadow">
                Signup
              </Button>
            </Link>
          </div>
        </form>
      </Form>
    </FullScreenCard>
  );
}
