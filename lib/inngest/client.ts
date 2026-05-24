import { Inngest } from "inngest";

// Create the Inngest client — used to send events and define functions
export const inngest = new Inngest({
  id: "nexora-ai",
  name: "Nexora AI",
});