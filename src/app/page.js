import Image from "next/image";

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="font-bold roboto">Request a LOA in your preferred hospital</h1>
      {process.env.NEXT_PUBLIC_DEPLOYED_BACKEND_API}
    </div>
  );
}
