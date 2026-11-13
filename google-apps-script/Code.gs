/**
 * RSVP collector for the wedding invitation.
 *
 * Paste this whole file into the Apps Script editor of a Google Sheet
 * (see SETUP.md), deploy it as a Web app, and put the Web app URL into
 * event-data.js (rsvp.endpoint). Every RSVP then becomes one row.
 *
 * Safe by design:
 *  - a hidden "website" field catches simple bots (real guests never see it)
 *  - the same reply sent twice (a retry) is stored once
 *  - everything is stored as plain text, so a name that starts with "=" can
 *    never run as a spreadsheet formula
 *  - lengths are capped, and only this one sheet is ever written to
 */

const SHEET_NAME = "RSVPs";
const HEADERS = ["Received", "Name", "Coming?", "Guests (5 = 5 or more)", "Blessing", "Reference"];

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);

    const raw = e && e.postData && e.postData.contents ? e.postData.contents : "";
    if (raw.length > 5000) return reply_({ ok: false, error: "too large" });

    const data = JSON.parse(raw);
    if (data.website) return reply_({ ok: true });          // honeypot: bots fill hidden fields

    const name = clean_(data.name, 80);
    if (!name) return reply_({ ok: false, error: "name required" });

    const coming = data.attendance === "attending";
    const guests = coming ? guests_(data.count) : 0;
    const blessing = clean_(data.blessing, 500);
    const id = clean_(data.id, 40);

    const sheet = sheet_();
    if (id && isDuplicate_(sheet, id)) return reply_({ ok: true, duplicate: true });

    const row = sheet.getLastRow() + 1;
    const range = sheet.getRange(row, 1, 1, HEADERS.length);
    range.setNumberFormats([["yyyy-mm-dd hh:mm", "@", "@", "0", "@", "@"]]);   // text only, no formulas
    range.setValues([[new Date(), name, coming ? "Yes" : "No", guests, blessing, id]]);

    return reply_({ ok: true });
  } catch (err) {
    return reply_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

// Opening the Web app URL in a browser is a quick way to check it is deployed.
function doGet() {
  return reply_({ ok: true, message: "RSVP collector is running" });
}

function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function clean_(value, max) {
  let s = String(value == null ? "" : value).replace(/[\u0000-\u001f\u007f]+/g, " ").trim();
  if (s.length > max) s = s.slice(0, max);
  return s;
}

// "5+" in the form is stored as 5
function guests_(value) {
  const n = parseInt(String(value), 10);
  if (isNaN(n) || n < 1) return 1;
  return Math.min(n, 5);
}

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  }
  return sheet;
}

function isDuplicate_(sheet, id) {
  const last = sheet.getLastRow();
  if (last < 2) return false;
  const ids = sheet.getRange(2, HEADERS.length, last - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === id) return true;
  }
  return false;
}
