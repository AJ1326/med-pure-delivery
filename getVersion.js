// const { gitDescribeSync } = require('git-describe');
const { version } = require('./package.json');
const { resolve, relative } = require('path');
const { writeFileSync } = require('fs-extra');

// const gitInfo = gitDescribeSync({
//   dirtyMark: false,
//   dirtySemver: false
// });

// gitInfo.version = version;

const file = resolve(__dirname, 'src', 'environments', 'version.ts');

const info = {
  appVersion: version,
  // appVersion: gitInfo.version,
  gitHash: process.argv[2]
};
writeFileSync(
  file,
  `// IMPORTANT: THIS FILE IS AUTO GENERATED! DO NOT MANUALLY EDIT OR CHECKIN!
/* tslint:disable */
export const VERSION = ${JSON.stringify(info, null, 4)};
/* tslint:enable */
`,
  { encoding: 'utf-8' }
);

console.log(`Wrote version info ${info.appVersion} to ${relative(resolve(__dirname, '..'), file)}`);
