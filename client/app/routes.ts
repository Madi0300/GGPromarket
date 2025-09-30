import { type RouteConfig, index, layout } from "@react-router/dev/routes";

export default [
  layout(
    "routes/headerBoard/HeaderBoard.tsx",
    [index("routes/Home/home.tsx", { id: "home" })],
    { id: "root-layout" }
  ),
] satisfies RouteConfig;
