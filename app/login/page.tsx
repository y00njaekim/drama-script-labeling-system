import { headers, cookies } from "next/headers";
import { SubmitButton } from "./submit-button";
import { APIResponse } from "@/types/types";
import { redirect } from "next/navigation";

const signInWithEmail = async (formData: FormData) => {
  "use server";
  const origin = headers().get("origin");
  const email = formData.get("email") as string;
  const pnum = formData.get("pnum") as string;

  const response = await fetch(`${origin}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, pnum }),
  });

  const data: APIResponse = await response.json();
  if (response.ok) {
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      const cookieParts = setCookieHeader.split(';');
      const cookieName = cookieParts[0].split('=')[0].trim();
      const cookieValue = cookieParts[0].split('=')[1].trim();
      const cookieOptions: Record<string, string> = {}; // QUESTION: Record 타입?
    
      for (let i = 1; i < cookieParts.length; i++) {
        const [key, value] = cookieParts[i].split('=');
        cookieOptions[key.trim()] = value ? value.trim() : '';
      }
    
      cookies().set({
        name: cookieName,
        value: cookieValue,
        httpOnly: cookieOptions.hasOwnProperty('HttpOnly'),
        secure: process.env.NODE_ENV === 'production',
        maxAge: parseInt(cookieOptions['Max-Age']),
        path: cookieOptions['Path'],
      });
      return redirect("/label");
    }
  } 

  return redirect(`/login?message=${data.message}`);
};

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
  }) {

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="pnum">
          Participant Number
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="pnum"
          placeholder="Given Participant Number"
          required
        />
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
            {searchParams.message}
          </p>
        )}
        <SubmitButton
          formAction={signInWithEmail}
          className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
          pendingText="Signing In With Email..."
        >
          Sign In
        </SubmitButton>
      </form>
    </div>
  );
}
