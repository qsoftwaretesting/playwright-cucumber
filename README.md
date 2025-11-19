# Playwright + Cucumber (BDD) scaffold

This folder contains a small Playwright + Cucumber.js example that runs a simple API test against the video game API.

Quick start

1. Install dependencies (this will also install Playwright browsers via postinstall):

```bash
cd /playwright-cucumber
npm install
```

2. Run the tests (this will create a JSON report in `reports/`):

```bash
npm test
```

3. Generate an HTML report from the JSON output (or run both in sequence):

```bash
npm run report
# or run both in sequence
npm run test:html
```

Notes

- Tests read the API base URL and endpoints from the local `fixtures/endpoints.json` file in this repository.
- A small fixture helper is provided at `features/support/fixtures.js` with `loadFixture(name)` to read JSON fixtures from `fixtures/{name}.json`.
- Fixtures are injected into Cucumber's World automatically by `features/support/world.js`. In step definitions you can access fixtures as `this.fixtures.endpoints`, `this.fixtures.credentials`, or `this.fixtures.games`.
- The example uses Playwright's `request` API (so it does not open a browser) to perform API calls.

Files of interest

- `features/example.feature` - Cucumber feature file
- `features/step_definitions/steps.js` - Step implementations using Playwright
- `generate-report.js` - Simple script to produce an HTML report from Cucumber JSON

Here are several easy ways to open cucumber-report.html from your machine — pick whichever fits your environment.

File path
- Absolute path: cucumber-report.html

Open with your desktop/browser (Linux)
- From the project root in a terminal:
```bash
# open with the system default browser
xdg-open reports/cucumber-report.html
```
- Open with Chrome/Chromium specifically:
```bash
google-chrome reports/cucumber-report.html
# or
chromium-browser reports/cucumber-report.html
```

Open from VS Code
- In VS Code's Explorer, click cucumber-report.html to open the file in the editor, then right-click → "Reveal in File Manager" and double-click it, or use an extension like "Live Server" / "Open in Browser" to open it in your default browser.

Serve it over HTTP (useful for assets or when viewing on another device)
- Using Python (simple, in project root):
```bash
# serve the reports/ directory at http://localhost:8000
python3 -m http.server 8000 --directory reports
# then open:
# http://localhost:8000/cucumber-report.html
```
- Or using a tiny Node static server (if you prefer):
```bash
npx serve reports
# then open the printed URL
```

If you're on WSL
- Use:
```bash
# open with the Windows default browser
wslview reports/cucumber-report.html
```

Notes and cautions
- The load test implementation is intentionally simple with @performance:

```bash
npx cucumber-js --require './features/**/*.js' --format json:reports/cucumber-report.json --tags "@performance"
```
Performance testing with k6

This repository includes a lightweight k6 load test and a small report-generator so CI can run performance tests and upload readable HTML reports as artifacts.

Files added:
- `k6/load_test.js` — k6 script that reads `fixtures/endpoints.json` and exercises the games list endpoint. It supports `K6_VUS` and `K6_DURATION` environment variables.
- `scripts/generate-k6-report.js` — Node script that converts `reports/k6-summary.json` (produced by k6 via `--summary-export`) into `reports/k6-report.html`.
- `.github/workflows/ci.yml` — GitHub Actions workflow that runs tests and the k6 performance job, then uploads `reports/k6-*` as an artifact named `k6-reports`.

Run k6 locally

1. Install k6 on your machine (or use Docker):

  - macOS (Homebrew):
    ```bash
    brew install k6
    ```

  - Debian/Ubuntu (apt):
    ```bash
    sudo apt install -y k6
    ```

  - Or use Docker:
    ```bash
    docker run --rm -i grafana/k6 run - <k6/load_test.js
    ```

2. Run the load test and export a summary and raw results (example):

```bash
# create reports/ if it doesn't exist
mkdir -p reports
K6_VUS=10 K6_DURATION=30s k6 run --summary-export=reports/k6-summary.json --out json=reports/k6-results.json k6/load_test.js
```

3. Generate an HTML report from the summary JSON:

```bash
node scripts/generate-k6-report.js
# open reports/k6-report.html in a browser
```

What the GitHub workflow does

- Runs `npx cucumber-js` for functional tests (skips scenarios tagged `@manual` or `@performance` by default).
- Runs the k6 load test with `grafana/k6-action`, exports a summary (`reports/k6-summary.json`) and raw results (`reports/k6-results.json`).
- Runs `node scripts/generate-k6-report.js` to create `reports/k6-report.html`.
- Uploads the three files as an artifact `k6-reports` so they can be downloaded and viewed from the GitHub Actions UI.

Downloading the CI artifact

After a run, open the workflow run in GitHub, find the "Artifacts" section, and download `k6-reports`. The archive contains `reports/k6-summary.json`, `reports/k6-results.json`, and `reports/k6-report.html` which you can open in a browser.
