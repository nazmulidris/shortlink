/*
 *   Copyright (c) 2023 R3BL LLC
 *   All rights reserved.
 *
 *   Permission is hereby granted, free of charge, to any person obtaining a copy
 *   of this software and associated documentation files (the "Software"), to deal
 *   in the Software without restriction, including without limitation the rights
 *   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *   copies of the Software, and to permit persons to whom the Software is
 *   furnished to do so, subject to the following conditions:
 *
 *   The above copyright notice and this permission notice shall be included in all
 *   copies or substantial portions of the Software.
 *
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *   SOFTWARE.
 */

import { Delays, Messages, showToast, triggerAutoCloseWindowWithDelay } from "./toast"
import { Urls } from "./types"

/**
 * Copy the short URL to the clipboard.
 * More info: https://stackoverflow.com/questions/49618618/copy-current-url-to-clipboard
 */
const copyToClipboardFallback = (text: string) => {
  const dummy = document.createElement("input")
  document.body.appendChild(dummy)
  dummy.value = text
  dummy.select()
  document.execCommand("copy")
  document.body.removeChild(dummy)
}

/**
 * https://stackoverflow.com/a/59695008/2085356
 * https://developer.chrome.com/docs/extensions/mv3/declare_permissions/
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard#writing_to_the_clipboard
 */
const copyToClipboard = (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(
      undefined /* Clipboard successfully set. */,
      () => copyToClipboardFallback(text) /* Clipboard write failed, use fallback. */
    )
}

export function copyShortlinkUrlToClipboard(shortlinkName: string) {
  chrome.storage.sync.get(shortlinkName, (result) => {
    const urls: Urls = result[shortlinkName]
    if (urls === undefined || urls.length === 0) {
      showToast("Please provide a saved shortlink to copy URL(s) from", Delays.done, "warning")
      return
    }

    const text = urls.join("\n")
    copyToClipboard(text)

    showToast(Messages.copyToClipboard, Delays.done, "success")
    triggerAutoCloseWindowWithDelay()
  })
}
