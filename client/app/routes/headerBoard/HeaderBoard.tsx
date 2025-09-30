import { Outlet, type ClientLoaderFunctionArgs } from "react-router";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import type { LayoutPayload } from "../../api/types";
import { fetchFromApi } from "../../utils/api";

export async function clientLoader({ request }: ClientLoaderFunctionArgs) {
  const [config, footer] = await Promise.all([
    fetchFromApi<LayoutPayload["config"]>(request, "/api/config"),
    fetchFromApi<LayoutPayload["footer"]>(request, "/api/footer"),
  ]);

  return { config, footer } satisfies LayoutPayload;
}

export default function HeaderBoard() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
