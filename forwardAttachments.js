// Configuration (customize these as needed)
const CONFIG = {
  searchQuery: "Report Update",         // Keyword to search in email subjects
  recipient1: "team1@example.com",      // First recipient
  recipient2: "team2@example.com",      // Second recipient
  attachmentKeyword: "report_file",     // Part of attachment filename to filter
  logSpreadsheetId: "YOUR_SPREADSHEET_ID_HERE", // Google Sheet ID for logging
  logSheetName: "Activity Log",         // Sheet name for logging
};

// Main function to forward emails with attachments
function forwardAttachments() {
  // Search for unread emails with the keyword, excluding trash and sent
  const threads = GmailApp.search(`${CONFIG.searchQuery} -in:trash -in:sent`);

  for (let i = 0; i < threads.length; i++) {
    const messages = threads[i].getMessages();

    for (let j = 0; j < messages.length; j++) {
      const message = messages[j];
      if (message.isUnread()) {
        const subject = message.getSubject();
        const itemName = subject.replace(CONFIG.searchQuery, "").trim() || "UNKNOWN ITEM";

        // Find the attachment
        const attachments = message.getAttachments();
        let targetAttachment = null;
        for (let k = 0; k < attachments.length; k++) {
          if (attachments[k].getName().includes(CONFIG.attachmentKeyword)) {
            targetAttachment = attachments[k];
            break;
          }
        }

        // If attachment exists, forward it
        if (targetAttachment) {
          const newSubject = `Forwarded Report - ${itemName}`;

          // Email content for recipient 1 (customize as needed)
          const body1 = `
Dear Team 1,

Good day,
Please find the attached report for ${itemName}.
Thank you.

Regards,
Automation Assistant
`;

          // Email content for recipient 2 (customize as needed)
          const body2 = `
Dear Team 2,

Good day,
Please find the attached report for ${itemName}.
Thank you.

Regards,
Automation Assistant
`;

          // Send to recipient 1
          MailApp.sendEmail({
            to: CONFIG.recipient1,
            subject: newSubject,
            body: body1,
            attachments: [targetAttachment],
          });

          // Send to recipient 2
          MailApp.sendEmail({
            to: CONFIG.recipient2,
            subject: newSubject,
            body: body2,
            attachments: [targetAttachment],
          });

          // Log the action
          logActivity(itemName);
        } else {
          Logger.log(`No matching attachment in email - Subject: ${subject}`);
        }
      }
    }
  }
}

// Log activity to a Google Sheet
function logActivity(itemName) {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.logSpreadsheetId);
  const sheet = spreadsheet.getSheetByName(CONFIG.logSheetName) || spreadsheet.insertSheet(CONFIG.logSheetName);
  const timestamp = new Date();
  sheet.appendRow([timestamp, itemName, `Sent to ${CONFIG.recipient1} and ${CONFIG.recipient2}`]);
}

// Set up a trigger to run every 5 minutes (adjust interval as needed)
function setupTrigger() {
  ScriptApp.newTrigger("forwardAttachments")
    .timeBased()
    .everyMinutes(5)
    .create();
}