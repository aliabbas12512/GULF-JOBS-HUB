import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Gulf Job Hub",
    short_name: "Gulf Job Hub",
    description: "Find Your Next Career in the Gulf",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f8fa",
    theme_color: "#0a1930",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
