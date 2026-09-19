# HSU Video Controller

Keyboard controls for seeking native videos on `dttt.hoasen.edu.vn`.

## English

### Features

- Press **Left Arrow** to seek backward.
- Press **Right Arrow** to seek forward.
- Chrome/Chromium and Zen/Firefox editions support a popup for enabling or
  disabling shortcuts and choosing a 5, 10, 15, or 30 second interval.
- Shortcuts are disabled while typing in form fields and do not override
  browser shortcuts that use modifier keys.

### Installation

#### Chrome or Chromium

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Select **Load unpacked**.
4. Choose the `chrome-browser/` directory.

#### Zen Browser or Firefox

1. Open `about:debugging#/runtime/this-firefox`.
2. Select **Load Temporary Add-on**.
3. Choose `firefox-browser/manifest.json`.

Temporary add-ons are removed when the browser restarts. For a permanent
installation, package and sign the extension through the
[Firefox Add-on Developer Hub](https://addons.mozilla.org/developers/).

#### Qutebrowser

1. Create the Greasemonkey directory:

   ```bash
   mkdir -p ~/.local/share/qutebrowser/greasemonkey
   ```

2. Copy `qutebrowser/hoa-sen-video-arrow-keys.user.js` into that directory.
3. Run `:greasemonkey-reload` in Qutebrowser.
4. Reload the Hoa Sen LMS page.

JavaScript must be enabled for `dttt.hoasen.edu.vn`. To change the Qutebrowser
seek interval, edit `SEEK_SECONDS` in the userscript and reload Greasemonkey.

## Tiếng Việt

### Tính năng

- Nhấn **mũi tên trái** để tua lùi video.
- Nhấn **mũi tên phải** để tua tới video.
- Phiên bản Chrome/Chromium và Zen/Firefox có cửa sổ bật lên để bật hoặc tắt
  phím tắt và chọn khoảng tua 5, 10, 15 hoặc 30 giây.
- Phím tắt sẽ tạm dừng khi đang nhập liệu và không ghi đè phím tắt của trình
  duyệt có sử dụng phím bổ trợ.

### Cài đặt

#### Chrome hoặc Chromium

1. Mở `chrome://extensions`.
2. Bật **Developer mode** (Chế độ nhà phát triển).
3. Chọn **Load unpacked** (Tải tiện ích đã giải nén).
4. Chọn thư mục `chrome-browser/`.

#### Zen Browser hoặc Firefox

1. Mở `about:debugging#/runtime/this-firefox`.
2. Chọn **Load Temporary Add-on** (Tải tiện ích tạm thời).
3. Chọn tệp `firefox-browser/manifest.json`.

Tiện ích tạm thời sẽ bị gỡ khi trình duyệt khởi động lại. Để cài đặt lâu dài,
hãy đóng gói và ký tiện ích thông qua
[Firefox Add-on Developer Hub](https://addons.mozilla.org/developers/).

#### Qutebrowser

1. Tạo thư mục Greasemonkey:

   ```bash
   mkdir -p ~/.local/share/qutebrowser/greasemonkey
   ```

2. Sao chép `qutebrowser/hoa-sen-video-arrow-keys.user.js` vào thư mục đó.
3. Chạy lệnh `:greasemonkey-reload` trong Qutebrowser.
4. Tải lại trang Hoa Sen LMS.

Cần bật JavaScript cho `dttt.hoasen.edu.vn`. Để thay đổi khoảng tua trong
Qutebrowser, sửa `SEEK_SECONDS` trong userscript rồi tải lại Greasemonkey.
