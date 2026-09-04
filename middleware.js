import { withAuth } from "next-auth/middleware";
import { ensureAuthEnv } from "./lib/env";

ensureAuthEnv();

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/home"],
};
