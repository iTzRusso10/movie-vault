import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import appCss from "../styles/index.css?url";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      { title: "MovieVault" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  component: RootLayout,
});

function RootLayout() {
  return (
    <html lang="it">
      <head>
        <HeadContent />
      </head>
      <body>
        <div id="app">
          <div className="mv-atmosphere" aria-hidden>
            <div className="mv-vignette" />
            <div className="mv-noise" />
          </div>
          <Navbar />
          <main className="relative z-10">
            <Outlet />
          </main>
          <Footer />
        </div>
        <Scripts />
      </body>
    </html>
  );
}
