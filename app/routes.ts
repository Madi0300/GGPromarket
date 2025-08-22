import { type RouteConfig, index, layout } from "@react-router/dev/routes";

export default [
  layout("routes/headerBoard/headerBoard.tsx", [index("routes/Home/home.tsx")]),
] satisfies RouteConfig;
