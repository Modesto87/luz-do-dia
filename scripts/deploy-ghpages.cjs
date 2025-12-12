const path = require('path');
const os = require('os');

// Workaround for Node 24+ in this environment:
// `find-cache-dir` returns undefined which breaks `gh-pages`.
process.env.CACHE_DIR = process.env.CACHE_DIR || path.join(os.homedir(), '.cache', 'gh-pages');

const ghpages = require('gh-pages');

ghpages.publish(
  'build',
  {
    repo: 'https://github.com/Modesto87/luz-do-dia.git',
    branch: 'gh-pages',
    dotfiles: true,
  },
  (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log('Published to gh-pages');
  }
);
