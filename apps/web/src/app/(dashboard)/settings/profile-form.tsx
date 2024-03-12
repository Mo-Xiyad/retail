"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useFieldArray, useForm } from "react-hook-form";
import { useUser } from "@/lib/useUser";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { pb } from "@/lib/pb";
import { ClientResponseError } from "pocketbase";
import { useRouter } from "next/navigation";
import { Icons } from "@/components/ui/icons";

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const user = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name,
    },
    mode: "onChange",
  });

  async function onSubmit(data: ProfileFormValues) {
    if (!user) throw new Error("User not found");
    setIsLoading(true);

    try {
      await pb.collection("users").update(user.id, {
        name: data.name,
      });
    } catch (error) {
      if (error instanceof ClientResponseError) {
        toast({
          title: "An unexpected error occurred",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "An unexpected error occurred",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    }

    toast({
      title: "Succcesfully updated profile",
      description: "Your profile has been updated.",
    });

    router.refresh();
    setIsLoading(false);
  }

  if (!user) return <Skeleton className="w-full h-24" />;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="text-white">
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Update profile
        </Button>
      </form>
    </Form>
  );
}
