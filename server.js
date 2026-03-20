import http from "http";
import url from "url";

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  console.log("\n====================");
  console.log("👉 Method:", req.method);
  console.log("👉 URL:", req.url);
  console.log("👉 Path:", parsedUrl.pathname);
  console.log("👉 Raw Query:", parsedUrl.search);
  console.log("👉 Parsed Query:", parsedUrl.query);
  console.log("====================\n");

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: true }));
});

server.listen(3000, () => {
  console.log("🚀 Server chạy tại http://localhost:3000");
});
