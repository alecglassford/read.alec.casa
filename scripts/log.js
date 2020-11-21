#!/usr/bin/env deno

const decoder = new TextDecoder("utf-8");

const buildEndpoint = async function buildEndpoint() {
  const [secret] = Deno.args;
  const stdinBuf = await Deno.readAll(Deno.stdin);
  const [url, star] = decoder.decode(stdinBuf).split("***");
  const encodedUrl = encodeURIComponent(url);
  let endpoint =
    `https://alec-reads.glitch.me/read?secret=${secret}&url=${encodedUrl}`;
  if (star) {
    endpoint += "&star=%20";
    if (star !== "nocomment") {
      endpoint += encodeURIComponent(star);
    }
  }
  return endpoint;
};

const main = async function main() {
  const endpoint = await buildEndpoint();
  try {
    const res = await fetch(endpoint, { method: "POST" });
    console.log(res.statusText);
  } catch (err) {
    console.log(err);
  }
};

main();
