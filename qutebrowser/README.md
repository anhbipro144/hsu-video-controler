# Hoa Sen Video Arrow Keys for Qutebrowser

This edition is a Greasemonkey script for Qutebrowser. It seeks visible native
videos on `dttt.hoasen.edu.vn` with the left and right arrow keys.

## Install

1. Create Qutebrowser's Greasemonkey directory:
   `mkdir -p ~/.local/share/qutebrowser/greasemonkey`
2. Copy `hoa-sen-video-arrow-keys.user.js` into that directory.
3. Run `:greasemonkey-reload` in Qutebrowser.
4. Reload the Hoa Sen LMS page.

The script requires JavaScript to be enabled for `dttt.hoasen.edu.vn`.

## Configure

Set `SEEK_SECONDS` near the top of
`hoa-sen-video-arrow-keys.user.js` to the desired interval, then run
`:greasemonkey-reload` and reload the LMS page.

## Use

- **Left Arrow** seeks backward.
- **Right Arrow** seeks forward.

Shortcuts do not run while typing in a form field and do not override browser
shortcuts involving modifier keys.
