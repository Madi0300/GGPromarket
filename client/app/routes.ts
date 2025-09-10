import { type RouteConfig, index, layout } from "@react-router/dev/routes";

export default [
  layout("routes/headerBoard/HeaderBoard.tsx", [index("routes/Home/home.tsx")]),
] satisfies RouteConfig;
