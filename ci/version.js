const pkg = require('../package.json');
const [ major, minor, patch ] = pkg.version.split('.');
if (process.env.CI_PIPELINE_ID) {
  if (process.env.CI_COMMIT_REF_SLUG === 'master') {
    // Master build pipeline
    console.log(`${major}.${minor}.${process.env.CI_PIPELINE_ID}`);
  } else {
    // Branch build pipeline
    console.log(`${major}.${minor}.${process.env.CI_PIPELINE_ID}-beta`);
  }
} else {
  // Run outside of build pipeline
  console.log(`${major}.${minor}.${patch}-local`);
}
