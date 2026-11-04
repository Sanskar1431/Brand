import { NextRequest, NextResponse } from "next/server";

const DEFAULT_BLOB_URL =
  process.env.NEXT_PUBLIC_VARUN_VIDEO_URL ||
  "https://knlayhbwsv3ccvs3.public.blob.vercel-storage.com/Solo%20Leveling%20S02E01%20%5BHindi%5D_1080P%20FHD.mp4";

export async function GET(request: NextRequest) {
  try {
    const rangeHeader = request.headers.get("range");

    const fetchHeaders: HeadersInit = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    };

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      fetchHeaders["Authorization"] = `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`;
    }

    if (rangeHeader) {
      fetchHeaders["Range"] = rangeHeader;
    }

    const upstreamResponse = await fetch(DEFAULT_BLOB_URL, {
      headers: fetchHeaders,
    });

    const responseHeaders = new Headers();
    responseHeaders.set(
      "Content-Type",
      upstreamResponse.headers.get("Content-Type") || "video/mp4"
    );
    responseHeaders.set("Accept-Ranges", "bytes");
    responseHeaders.set("Access-Control-Allow-Origin", "*");
    responseHeaders.set("Cache-Control", "public, max-age=31536000, immutable");

    const contentLength = upstreamResponse.headers.get("Content-Length");
    if (contentLength) {
      responseHeaders.set("Content-Length", contentLength);
    }

    const contentRange = upstreamResponse.headers.get("Content-Range");
    if (contentRange) {
      responseHeaders.set("Content-Range", contentRange);
    }

    return new NextResponse(upstreamResponse.body, {
      status: upstreamResponse.status,
      headers: responseHeaders,
    });
  } catch (err) {
    console.error("Video stream proxy error:", err);
    return NextResponse.redirect(DEFAULT_BLOB_URL, 307);
  }
}
