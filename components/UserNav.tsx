import { auth, signIn, signOut } from "@/app/auth";
import Link from "next/link";

export async function UserNav() {
  const session = await auth();

  if (!session?.user) {
    return (
      <form
        action={async () => {
          "use server";
          await signIn("github");
        }}
      >
        <button
          type="submit"
          className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-md font-medium text-sm"
        >
          Sign In with GitHub
        </button>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/my-tickets"
        className="text-sm font-medium hover:underline text-zinc-700 dark:text-zinc-300"
      >
        My Tickets
      </Link>

      <span className="text-sm font-semibold">{session.user.name}</span>

      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button
          type="submit"
          className="px-3 py-1.5 text-xs border rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800"
        >
          Sign Out
        </button>
      </form>
    </div>
  );
}