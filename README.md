# TypeSprint — browser edition
A quiet typing practice app with a charcoal and mint interface. Runs locally without an executable, account, CDN, or build step.

## Open
Extract the whole ZIP into one folder and open index.html in a modern browser. Keep app.js, core.js and style.css beside it.

Link:https://danenlarping333.github.io/TypeSprint/

## Modes
- Time: 15 / 30 / 60 / 120 seconds.
- Words: 10 / 25 / 50 / 100 words.
- Quote: original English practice passages.
- Zen: free writing, ended with Finish session (20,000 character limit).
- Custom: English ASCII text, up to 4,000 characters; whitespace is normalized.

Punctuation and numbers apply to Time and Words. First character starts the clock. Changing options or Escape resets the run. Timer continues in background tabs. Paste is disabled in the test; use Custom to paste a passage. Editing is limited to the end of the typed text.

## Scores and privacy
WPM = correct retained characters / 5 / elapsed minutes. Raw WPM includes all attempts. Accuracy remembers corrected mistakes. Zen has no accuracy score.
Only standard 30/60-second Time tests save personal bests to localStorage. Clearing site data or changing browser/address can remove or separate scores. Custom text and typing history are not persisted. No analytics or external requests.

## GitHub Pages
Upload this folder's CONTENTS to the repository root, including .nojekyll. In Settings > Pages, publish main and / (root). Use the URL GitHub displays after deployment. Repository path capitalization matters.

## Development
No dependencies. Run node core.test.cjs for scoring and content-generation checks. Primarily designed for a physical keyboard. The character display is not a full screen-reader testing interface.

## License
MIT. See LICENSE.
