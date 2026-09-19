# Hoa Sen Video Arrow Keys for Zen Browser

A Manifest V3 Zen Browser extension that adds keyboard seeking to native video
players on `dttt.hoasen.edu.vn`.

## Install

1. In Zen Browser, open `about:debugging#/runtime/this-firefox`.
2. Select **Load Temporary Add-on**.
3. Choose `zen-browser/manifest.json` from this project.

Temporary add-ons are removed when Zen Browser restarts. To keep the extension
installed, package and sign it through [Firefox Add-on Developer Hub](https://addons.mozilla.org/developers/).

## Use

On a Hoa Sen LMS page containing a video:

- **Left Arrow** seeks backward.
- **Right Arrow** seeks forward.

The toolbar popup lets you disable the shortcuts or choose a 5, 10, 15, or 30
second seek interval. Shortcuts do not run while typing in a form field and do
not override browser shortcuts involving modifier keys.
