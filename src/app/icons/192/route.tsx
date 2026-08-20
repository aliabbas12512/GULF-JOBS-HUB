import { ImageResponse } from "next/og";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a1930",
        }}
      >
        <div
          style={{
            width: "70%",
            height: "70%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 9999,
            border: "6px solid #d9a441",
            color: "#d9a441",
            fontSize: 90,
            fontWeight: 700,
            fontFamily: "sans-serif",
          }}
        >
          G
        </div>
      </div>
    ),
    {
      width: 192,
      height: 192,
      headers: { "Cache-Control": "public, max-age=86400, immutable" },
    }
  );
}
