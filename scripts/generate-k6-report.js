const fs = require('fs');
const path = require('path');

const summaryPath = path.resolve(process.cwd(), 'reports/k6-summary.json');
const outHtml = path.resolve(process.cwd(), 'reports/k6-report.html');

function safeReadJSON(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    return null;
  }
}

const summary = safeReadJSON(summaryPath);

let html = `<!doctype html>\n<html>\n<head>\n  <meta charset="utf-8" />\n  <title>k6 Summary</title>\n  <style>body{font-family:system-ui,Segoe UI,Roboto,Arial;margin:20px}pre{white-space:pre-wrap;background:#f6f8fa;padding:10px;border-radius:6px}canvas{max-width:100%;height:320px}</style>\n  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>\n</head>\n<body>\n<h1>k6 Summary</h1>\n`;

if (!summary) {
  html += `<p>No k6 summary found at <code>${summaryPath}</code>.</p>`;
  html += `<p>If you ran k6 with <code>--summary-export=reports/k6-summary.json</code> it should appear here. This page will show raw summary JSON below.</p>`;
  html += `<pre>${JSON.stringify({}, null, 2)}</pre>`;
  fs.mkdirSync(path.dirname(outHtml), { recursive: true });
  fs.writeFileSync(outHtml, html + '</body></html>', 'utf8');
  console.log('Wrote', outHtml);
  process.exit(0);
}

// Try to show some useful metrics if present
const metrics = summary.metrics || {};
html += `<p>Test start: ${summary.startTime || 'n/a'}</p>`;

// select a duration metric (prefer expected_response if available)
const durationMetric = metrics['http_req_duration{expected_response:true}'] || metrics['http_req_duration'];
if (durationMetric) {
  // k6 may present metric aggregates either as top-level keys or under .values
  const values = durationMetric.values || durationMetric || {};
  const avg = values.avg || values['avg'] || durationMetric.avg || durationMetric['avg'] || 0;
  const p95 = values['p(95)'] || values['p95'] || (durationMetric.quantiles && durationMetric.quantiles['95']) || durationMetric['p(95)'] || 0;
  const min = values.min || durationMetric.min || 0;
  const max = values.max || durationMetric.max || 0;

  html += `<h2>Response time summary</h2>`;
  html += `<canvas id="durationChart"></canvas>`;
  html += `<script>\n    const durationData = {\n      labels: ['min','avg','p95','max'],\n      datasets: [{\n        label: 'ms',\n        backgroundColor: ['#4e79a7','#59a14f','#e15759','#f28e2b'],\n        data: [${min}, ${avg}, ${p95}, ${max}]\n      }]\n    };\n    new Chart(document.getElementById('durationChart').getContext('2d'), {\n      type: 'bar',\n      data: durationData,\n      options: {responsive:true, plugins:{legend:{display:false}}}\n    });\n  </script>`;
}

// show some request-rate metrics
if (metrics['http_reqs']) {
  const reqs = (metrics['http_reqs'].count || metrics['http_reqs'].value || 0);
  const rate = metrics['http_reqs'].rate || '-';
  html += `<h2>Requests</h2><p>Total requests: <strong>${reqs}</strong></p><p>Rate: <strong>${rate}</strong> req/s</p>`;
}

html += `<h3>Raw JSON</h3><pre>${JSON.stringify(summary, null, 2)}</pre>`;

// link to cucumber report if exists
const cucumberPath = path.resolve(process.cwd(), 'reports/cucumber-report.html');
if (fs.existsSync(cucumberPath)) {
  html += `<p><a href="./cucumber-report.html">Open cucumber report</a></p>`;
}

html += `</body></html>`;

fs.mkdirSync(path.dirname(outHtml), { recursive: true });
fs.writeFileSync(outHtml, html, 'utf8');
console.log('Generated', outHtml);
