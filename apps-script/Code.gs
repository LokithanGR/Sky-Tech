/**
 * Sky Tech Offers + Gallery API (Google Apps Script)
 *
 * ✅ Offers sheet columns (Row 1):
 *   id | title | description | price | validTill | active
 *
 * ✅ Gallery sheet columns (Row 1):
 *   id | title | category | imageUrl | uploadedAt | active
 *
 * GET:
 *  - /exec                 -> offers
 *  - /exec?type=gallery     -> gallery (only active items)
 *
 * POST (admin):
 *  - { secret, action, payload }                 -> offers
 *  - { secret, type:"gallery", action, payload } -> gallery
 *  - { secret, type:"gallery", action:"list" }   -> gallery list (all)
 */

const OFFERS_SHEET_NAME = "Sheet1";   // change if needed
const GALLERY_SHEET_NAME = "Gallery"; // create this tab
const SECRET = "CHANGE_THIS_SECRET";  // set your own secret

function doGet(e) {
  const type = (e && e.parameter && e.parameter.type) ? String(e.parameter.type) : "offers";
  if (type === "gallery") return getGallery();
  return getOffers();
}

function getOffers() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(OFFERS_SHEET_NAME);

  const values = sh.getDataRange().getValues();
  const headers = values[0];

  const rows = values.slice(1).map(r => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = r[i]);
    return obj;
  });

  const activeOffers = rows.filter(o => String(o.active).toUpperCase() === "TRUE");
  return json({ ok: true, offers: activeOffers });
}

function getGallery() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(GALLERY_SHEET_NAME);

  const values = sh.getDataRange().getValues();
  const headers = values[0];

  const rows = values.slice(1).map(r => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = r[i]);
    return obj;
  });

  const activeItems = rows.filter(o => String(o.active).toUpperCase() === "TRUE");
  return json({ ok: true, items: activeItems });
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents || "{}");
  if (body.secret !== SECRET) return json({ ok: false, message: "Unauthorized" });

  const type = body.type === "gallery" ? "gallery" : "offers";
  if (type === "gallery") return postGallery(body);
  return postOffers(body);
}

// ---------- Offers Admin ----------
function postOffers(body) {
  const action = body.action; // add | update | delete
  const payload = body.payload || {};

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(OFFERS_SHEET_NAME);
  const values = sh.getDataRange().getValues();
  const headers = values[0];

  const idCol = headers.indexOf("id") + 1;
  if (idCol <= 0) return json({ ok: false, message: "No 'id' column" });

  if (action === "add") {
    const newRow = headers.map(h => payload[h] ?? "");
    sh.appendRow(newRow);
    return json({ ok: true });
  }

  const id = String(payload.id ?? "");
  let rowIndex = -1;
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][idCol - 1]) === id) { rowIndex = i + 1; break; }
  }
  if (rowIndex === -1) return json({ ok: false, message: "ID not found" });

  if (action === "update") {
    headers.forEach((h, idx) => {
      if (payload[h] !== undefined) sh.getRange(rowIndex, idx + 1).setValue(payload[h]);
    });
    return json({ ok: true });
  }

  if (action === "delete") {
    sh.deleteRow(rowIndex);
    return json({ ok: true });
  }

  return json({ ok: false, message: "Invalid action" });
}

// ---------- Gallery Admin ----------
function postGallery(body) {
  const action = body.action; // add | update | delete | list
  const payload = body.payload || {};

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(GALLERY_SHEET_NAME);
  const values = sh.getDataRange().getValues();
  const headers = values[0];

  const idCol = headers.indexOf("id") + 1;
  if (idCol <= 0) return json({ ok: false, message: "No 'id' column" });

  // list returns ALL (admin)
  if (action === "list") {
    const rows = values.slice(1).map(r => {
      const obj = {};
      headers.forEach((h, i) => obj[h] = r[i]);
      return obj;
    });
    return json({ ok: true, items: rows });
  }

  if (action === "add") {
    // auto uploadedAt if empty
    if (!payload.uploadedAt) payload.uploadedAt = Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd HH:mm");
    const newRow = headers.map(h => payload[h] ?? "");
    sh.appendRow(newRow);
    return json({ ok: true });
  }

  const id = String(payload.id ?? "");
  let rowIndex = -1;
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][idCol - 1]) === id) { rowIndex = i + 1; break; }
  }
  if (rowIndex === -1) return json({ ok: false, message: "ID not found" });

  if (action === "update") {
    headers.forEach((h, idx) => {
      if (payload[h] !== undefined) sh.getRange(rowIndex, idx + 1).setValue(payload[h]);
    });
    return json({ ok: true });
  }

  if (action === "delete") {
    sh.deleteRow(rowIndex);
    return json({ ok: true });
  }

  return json({ ok: false, message: "Invalid action" });
}

function json(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
