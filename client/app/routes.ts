import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/headerBoard/HeaderBoard.tsx", [
    route("/", "routes/Home/home.tsx", [
      route("product/:productId", "routes/Modal/Modal.tsx", {
        id: "product-detail",
      }),
    ]),
  ]),
  route("*", "routes/NotFound/NotFound.tsx"),
] satisfies RouteConfig;
