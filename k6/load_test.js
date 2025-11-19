import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

// options via env: K6_VUS, K6_DURATION
export let options = {
  vus: __ENV.K6_VUS ? parseInt(__ENV.K6_VUS, 10) : 10,
  duration: __ENV.K6_DURATION || '30s',
};

// read endpoints fixture shipped in repo
// k6's `open()` can resolve relative to the script file; try several candidate paths
let endpoints = null;
const _candidates = ['fixtures/endpoints.json', '../fixtures/endpoints.json', './fixtures/endpoints.json', '/src/fixtures/endpoints.json'];
for (const _p of _candidates) {
  try {
    const txt = open(_p);
    endpoints = JSON.parse(txt);
    break;
  } catch (e) {
    // ignore and try next
  }
}
if (!endpoints) {
  throw new Error('fixtures/endpoints.json not found in expected locations: ' + _candidates.join(', '));
}
const baseUrl = endpoints.baseUrl || 'http://localhost:3000';
const gamesPath = (endpoints.videoGame && endpoints.videoGame.list) || '/api/v2/videogame';
const url = `${baseUrl.replace(/\/$/, '')}${gamesPath}`;

export default function () {
  const res = http.get(url);
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1);
}

export function handleSummary(data) {
  return {
    'reports/k6-summary.json': JSON.stringify(data, null, 2),
  };
}
