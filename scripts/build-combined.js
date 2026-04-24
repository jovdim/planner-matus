// Runs after `react-scripts build`.
//
// react-scripts wrote the planner into build/ assuming a single-project deployment.
// We actually serve it at /planovac/ alongside a static hub page at the root, so we:
//   1. Relocate everything in build/ into build/planovac/
//   2. Copy hub/* into build/ (sits at the root of the deployment)
//
// Node 20+ (fs.cpSync, fs.rmSync with force+recursive). Safe to rerun.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BUILD = path.join(ROOT, 'build');
const HUB = path.join(ROOT, 'hub');
const PLANOVAC = path.join(BUILD, 'planovac');

if (!fs.existsSync(BUILD)) {
  console.error('[build-combined] build/ not found — did react-scripts build fail?');
  process.exit(1);
}
if (!fs.existsSync(HUB)) {
  console.error('[build-combined] hub/ not found at ' + HUB);
  process.exit(1);
}

// If a previous run already nested planovac/, clean it out before re-nesting.
if (fs.existsSync(PLANOVAC)) {
  fs.rmSync(PLANOVAC, { recursive: true, force: true });
}

// Move build/* into build/planovac/, EXCEPT planovac itself (we just recreated it).
const planner = fs.readdirSync(BUILD).filter((n) => n !== 'planovac');
fs.mkdirSync(PLANOVAC, { recursive: true });
for (const name of planner) {
  fs.renameSync(path.join(BUILD, name), path.join(PLANOVAC, name));
}

// Copy hub/* into build/ (overwrites anything the planner left at the root,
// though there should be nothing left there after the move above).
for (const name of fs.readdirSync(HUB)) {
  fs.cpSync(path.join(HUB, name), path.join(BUILD, name), { recursive: true });
}

console.log('[build-combined] assembled build/ — hub at /, planner at /planovac/');
