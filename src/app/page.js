import { redirect } from "next/navigation";

export default function Home() {
  // Instantly redirect on the server
  redirect("/request-loa");
}
