import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

export async function middleware(req: NextRequest) {
  const { supabase, response } = createClient(req);

  const { data } = await supabase.auth.getSession();

  // if user is try to access a page other than Dashboard, do nothing and redirect to dashboard 
  if (req.nextUrl.pathname !== "/dashboard") return response;

  const userLoggedIn = !!data?.session?.user;

  // if user is not logged in, redirect to waitlist page
  if (!userLoggedIn) {
    return NextResponse.redirect(req.nextUrl.origin + "/login");
  }

  // if user is logged in, fetch users data from waitlist entry
  const { data: waitlistEntry } = await supabase
  .from("waitlist")
  .select("approved")
  .eq("user_id", data.session?.user.id)
  .single();

if (waitlistEntry?.approved) return Response;

// if user is not approved yet, redirect to waitlist page
return NextResponse.redirect(req.nextUrl.origin + "/waitlist");

}