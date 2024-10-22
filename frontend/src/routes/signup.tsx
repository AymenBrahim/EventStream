import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Link, createFileRoute, useRouter } from "@tanstack/react-router";
import FullScreenCard from "@/components/full-screen-card";
import { UserAuthResponse } from "@/schemas";
import useAuthStore from "@/hooks/use-auth-store";
import useClient from "@/hooks/use-client";

export const Route = createFileRoute("/signup")({
  component: Signup,
});

const formSchema = z
  .object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    repeatPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    email: z
      .string()
      .min(8, {
        message: "Email must be at least 8 characters.",
      })
      .email("Please enter a valid Email"),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords don't match",
    path: ["repeatPassword"],
  });

export function Signup() {
  const router = useRouter();

  const signin = useAuthStore(({ signin }) => signin);
  const client = useClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      repeatPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await client.post<UserAuthResponse>(
      "/signup",
      JSON.stringify(values)
    );
    if (res.status === 201) {
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
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="JohnDoe95" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
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
                  <Input placeholder="**********" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="repeatPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repeat Password</FormLabel>
                <FormControl>
                  <Input placeholder="**********" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-6 space-y-3">
            <Button className="mt-9 w-3/4 mx-auto flex" type="submit">
              Signup
            </Button>
            <FormDescription className="w-full text-center m-0">
              Do you have an Account ?
            </FormDescription>
            <Link to={"/signin"}>
              <Button className="bg-teal-500 text-primary hover:text-teal-700  mt-3 w-3/4 mx-auto flex">
                Signin
              </Button>
            </Link>
          </div>
        </form>
      </Form>
    </FullScreenCard>
  );
}
