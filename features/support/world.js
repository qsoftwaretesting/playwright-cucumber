const { Before } = require('@cucumber/cucumber');
const fs = require('fs');
const path = require('path');

// Attach commonly-used fixtures to the Cucumber World so steps can access them
// as `this.fixtures.<name>`. This implementation dynamically loads all JSON
// files found in the repository `fixtures/` directory.
Before(function () {
  this.fixtures = this.fixtures || {};

  const fixturesDir = path.resolve(__dirname, '../../fixtures');
  if (!fs.existsSync(fixturesDir)) return; // nothing to do

  let files = [];
  try {
    files = fs.readdirSync(fixturesDir);
  } catch (e) {
    // unable to read fixtures directory; skip
    return;
  }

  files.forEach((file) => {
    if (!file.toLowerCase().endsWith('.json')) return;
    const name = path.basename(file, '.json');
    const filePath = path.join(fixturesDir, file);
    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      this.fixtures[name] = JSON.parse(raw);
    } catch (e) {
      // if parsing fails, skip this fixture but keep others
    }
  });
});
