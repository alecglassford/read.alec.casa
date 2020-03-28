#!/usr/bin/env node

const fs = require('fs');

const fetch = require('node-fetch');

const buildEndpoint = function buildEndpoint() {
  const secret = process.argv[2];
  const [url, star] = fs.readFileSync(process.stdin.fd, 'utf8').split('***');
  const encodedUrl = encodeURIComponent(url);
  let endpoint = `https://alec-reads.glitch.me/read?secret=${secret}&url=${encodedUrl}`;
  if (star) {
    endpoint += '&star=%20';
    if (star !== 'nocomment') {
      endpoint += star;
    }
  }
  return endpoint;
};

const main = async function main() {
  const endpoint = buildEndpoint();
  try {
    const res = await fetch(endpoint, { method: 'POST' });
    console.log(res.statusText);
  } catch (err) {
    console.log(err);
  }
};

main();
