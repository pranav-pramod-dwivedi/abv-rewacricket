// Cloudflare Pages Functions edge middleware: Accept: text/markdown negotiation & agent-friendly 404s
const MD_VARY = "Accept, Accept-Encoding";

const MCP_MANIFEST = {
  name: "abv-rewacricket-mcp",
  version: "1.0.0",
  protocolVersion: "2024-11-05",
  description: "Official Model Context Protocol (MCP) server for the Atal Bihari Vajpayee Memorial Tournament.",
  serverInfo: { name: "ABV Tournament MCP Server", version: "1.0.0" },
  tools: [
    {
      name: "get_tournament_stats",
      description: "Fetch tournament standings, head-to-head record, and aggregate statistics",
      inputSchema: { type: "object", properties: {} }
    },
    {
      name: "get_derby_matches",
      description: "Fetch list of 34 bilateral matches between Destroyers CC and Dread Eleven",
      inputSchema: { type: "object", properties: { season: { type: "string" } } }
    }
  ]
};

function wantsMarkdown(request) {
  const accept = request.headers.get("accept") || "";
  if (!accept.toLowerCase().includes("text/markdown")) return false;
  const entries = accept.split(",");
  let mdQ = -1;
  let htmlQ = -1;
  for (const raw of entries) {
    const [typePart, ...params] = raw.trim().split(";");
    const type = typePart.trim().toLowerCase();
    let q = 1;
    for (const p of params) {
      const m = p.trim().match(/^q\\s*=\\s*([0-9.]+)$/i);
      if (m) {
        const n = parseFloat(m[1]);
        if (!isNaN(n)) q = n;
      }
    }
    if (type === "text/markdown") mdQ = q;
    else if (type === "text/html" || type === "*/*") htmlQ = Math.max(htmlQ, q);
  }
  return mdQ > 0 && htmlQ <= mdQ;
}

function notFoundMarkdown(pathname, origin = "") {
  const safePath = String(pathname || "/").slice(0, 300);
  return `# 404 — Page Not Found\n\nThe requested path \`${safePath}\` does not exist on the **Atal Bihari Vajpayee Memorial Tournament** official portal — sanctioned by Rewa Division Cricket Association (RDCA).\n\n## Where to look next\n\n- [Tournament Home](${origin}/) — latest matches, standings and news\n- [llms.txt](${origin}/llms.txt) — machine-readable guide to this tournament portal\n- [Sitemap](${origin}/sitemap.xml) — complete URL inventory\n- [Teams](${origin}/teams/) · [Matches](${origin}/matches/) · [Leaderboards](${origin}/stats/)\n- [Regulations](${origin}/rules/) — 14 statutory codes and playing conditions\n- [About the Tournament](${origin}/about/) · [Governing Council](${origin}/governing-council/)\n- [Privacy Policy](${origin}/privacy/) · [Contact](${origin}/contact/)\n- [RDCA Central Archive](https://rewa-cricket-division.vercel.app/) — governing body archive\n\nTip: send \`Accept: text/markdown\` on any URL or append \`.md\` to receive clean Markdown tables.\n`;
}

export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);
  const accept = request.headers.get("accept") || "";
  const isHead = request.method === "HEAD";

  // MCP handshake
  if (url.pathname === "/.well-known/mcp" || url.pathname === "/.well-known/mcp/") {
    return new Response(isHead ? null : JSON.stringify(MCP_MANIFEST, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
        Vary: MD_VARY,
      },
    });
  }

  // Markdown negotiation
  if (wantsMarkdown(request)) {
    let mdPath = url.pathname === "/" ? "/index.md" : url.pathname.replace(/\\/+$/, "") + ".md";
    const assetFetcher = env?.ASSETS || { fetch: (...args) => fetch(...args) };
    const mdRes = await assetFetcher.fetch(new URL(mdPath, url.origin), { method: request.method });
    if (mdRes.ok) {
      return new Response(isHead ? null : mdRes.body, {
        status: 200,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          Vary: MD_VARY,
          "Cache-Control": "public, max-age=0, must-revalidate",
        },
      });
    }
    return new Response(isHead ? null : notFoundMarkdown(url.pathname, url.origin), {
      status: 404,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        Vary: MD_VARY,
        "Cache-Control": "public, max-age=0, must-revalidate",
      },
    });
  }

  const res = await next();

  if (res.status === 404) {
    const ua = request.headers.get("user-agent") || "";
    const isAgent =
      wantsMarkdown(request) ||
      !accept.includes("text/html") ||
      accept.includes("text/markdown") ||
      accept === "*/*" ||
      /curl|bot|spider|crawler|agent|ora|python|fetch/i.test(ua);

    if (isAgent) {
      return new Response(isHead ? null : notFoundMarkdown(url.pathname, url.origin), {
        status: 404,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          Vary: MD_VARY,
          "Cache-Control": "public, max-age=0, must-revalidate",
        },
      });
    }
  }

  const headers = new Headers(res.headers);
  headers.set("Vary", MD_VARY);
  return new Response(isHead ? null : res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}
