import { route } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

export default [
  route("/", "routes/home.tsx"),

  route(
    "/quizchamps/confirmation-email/:token",
    "resource-routes/email/confirmation-token.$token.ts"
  ),

  ...(await flatRoutes({
    ignoredRouteFiles: ["routes/home.tsx"],
  })),
];
