import { toast } from "@/components/ui/use-toast";
import { ClientResponseError } from "pocketbase";

export const handleError = (error: Error) => {
  if (error instanceof ClientResponseError) {
    console.log(error.data);
    const data = Object.entries(error.data.data)
      .map(([key, value]: [string, any]) => {
        return `\n${key}: ${value.message}`;
      })
      .join("\n");

    toast({
      title: "An unexpected error occurred",
      description: error.message + "\n" + data,
      variant: "destructive",
    });
  } else {
    toast({
      title: "An unexpected error occurred",
      description: "Please try again later.",
      variant: "destructive",
    });
  }
};
