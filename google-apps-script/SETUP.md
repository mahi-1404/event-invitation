# Save RSVPs to a Google Sheet

Every RSVP from the invitation becomes one row in your own Google Sheet:
time, name, coming or not, number of guests, blessing. It is free, works for any
number of guests, and you can open the sheet on your phone to see replies live.

You do this once. It takes about 5 minutes.

## 1. Make the sheet

1. Go to <https://sheets.google.com> and create a **blank spreadsheet**.
2. Name it, for example, **Wedding RSVPs**.

## 2. Add the script

1. In the sheet, click **Extensions > Apps Script**.
2. Delete everything in the editor (the sample `function myFunction() {}`).
3. Open `Code.gs` (in this folder), copy **all** of it, and paste it in.
4. Click the **Save** icon (or press Ctrl+S).

## 3. Publish it as a web app

1. Click **Deploy > New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**.
5. Google asks for permission. Click **Authorize access**, choose your account.
   If you see "Google hasn't verified this app", click **Advanced**, then
   **Go to (project name) (unsafe)**, then **Allow**. This is your own script
   writing to your own sheet, so it is safe.
6. Copy the **Web app URL**. It ends with `/exec`.

Quick check: paste that URL into a browser tab. You should see
`{"ok":true,"message":"RSVP collector is running"}`.

## 4. Connect the invitation

Open `event-data.js` and paste the URL between the quotes:

```js
rsvp: { endpoint: "https://script.google.com/macros/s/XXXXXXXX/exec" }
```

Then commit and push, as usual. (Or send the URL to whoever maintains the site.)

## 5. Test it

1. Open the live invitation, go to the RSVP form, and send a test reply.
2. Open your sheet. A tab called **RSVPs** appears with your test row.
3. Delete the test row.

## Good to know

- **Replies are private to you.** Only the person who owns the sheet sees them.
  The invitation tells guests: "Your reply is shared with Nithin N S and Lekhana C."
- **Guests who reply twice** (using "Update RSVP") add a second row. The newest row
  is their latest answer.
- **"5 or more" guests** is stored as 5.
- **Total guests coming:** in any empty cell type
  `=SUMIF(C:C,"Yes",D:D)`
- **Changing the script later:** use **Deploy > Manage deployments**, click the
  pencil, choose **New version**, and Deploy. The URL stays the same.
- **If you ever need to stop collecting:** empty the quotes in `rsvp.endpoint`
  again. The form goes back to keeping replies on the guest's own phone only.
- **Anyone who has the link can send a reply.** The link is visible in the site's
  code, as with any free setup like this. The script ignores simple bots, empty
  names and repeats, and never treats text as a spreadsheet formula, but nothing
  like this is completely spam-proof. Check the sheet now and then.
