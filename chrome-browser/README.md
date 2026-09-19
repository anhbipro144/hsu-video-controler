# Hoa Sen Video Arrow Keys

A Manifest V3 Chrome extension that adds keyboard seeking to native video players on `dttt.hoasen.edu.vn`.

For the Zen Browser edition, see [`zen-browser/`](zen-browser/). For
Qutebrowser, see [`qutebrowser/`](qutebrowser/).

## Install

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Select **Load unpacked**.
4. Choose this directory.

## Use

On a Hoa Sen LMS page containing a video:

- **Left Arrow** seeks backward.
- **Right Arrow** seeks forward.
- **Space** pauses or resumes the video.
- The video timeline appears for two seconds after seeking with an arrow key.

The popup lets you disable the shortcuts or choose a 5, 10, 15, or 30 second seek interval. Shortcuts do not run while typing in a form field and do not override browser shortcuts involving modifier keys.
