const reporter = require('cucumber-html-reporter');
const fs = require('fs');
const path = require('path');

const jsonReport = path.resolve(__dirname, 'reports', 'cucumber-report.json');
const htmlReport = path.resolve(__dirname, 'reports', 'cucumber-report.html');

if (!fs.existsSync(jsonReport)) {
  console.error('JSON report not found:', jsonReport);
  process.exit(2);
}

const options = {
  theme: 'bootstrap',
  jsonFile: jsonReport,
  output: htmlReport,
  reportSuiteAsScenarios: true,
  launchReport: false,
  metadata: {
    "App": "Video Game API",
    "Test Environment": "playwright-cucumber",
    "Platform": process.platform
  }
};

reporter.generate(options);
console.log('HTML report generated at', htmlReport);
