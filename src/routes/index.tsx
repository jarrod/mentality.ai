import { ComponentExample } from "@/components/component-example";
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from "@clerk/tanstack-react-start";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App
});

function App() {
  return (
    <div>
      <SignedIn>
        <UserButton />
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <ComponentExample />
    </div>
  );
}