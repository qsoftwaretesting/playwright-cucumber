const fs = require('fs');
const path = require('path');

function loadFixture(name) {
  const fixturesDir = path.resolve(__dirname, '../../fixtures');
  const filePath = path.join(fixturesDir, `${name}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Fixture not found: ${filePath}`);
  }
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

module.exports = { loadFixture };
