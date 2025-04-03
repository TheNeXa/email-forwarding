# Email Automation Project

This is a Google Apps Script project I built to handle email tasks more efficiently. It’s a practical tool that processes emails, extracts useful info, and forwards it where it needs to go—all automated.

## What It Can Do

- **Email Filtering**: Finds emails based on subjects or labels and processes them.
- **Data Extraction**: Pulls out details like names or dates from email text with regex.
- **Formatted Forwarding**: Creates clean HTML emails with the extracted info and sends them out.
- **Logging**: Records what it does in a Google Sheet for easy tracking.
- **Automation**: Runs on its own every few minutes with a trigger.

## How It Works

1. **Script 1: Email Processing**
   - Searches for emails with specific subjects or labels.
   - Extracts key details and builds a neat HTML email.
   - Forwards it to the right people and marks the email as done.

2. **Script 2: Attachment Forwarding**
   - Looks for unread emails with certain keywords and attachments.
   - Sends those attachments with a short message to recipients.
   - Logs the action in a sheet but leaves the email untouched.

## Sample Code

Here’s a simplified bit from the first script to show how it works:

```javascript
function processEmails() {
  var threads = GmailApp.search('subject:"Event Update" label:pending -label:done');
  for (var i = 0; i < threads.length; i++) {
    var message = threads[i].getMessages()[0];
    var subject = message.getSubject();
    var body = message.getPlainBody();

    // Extract details
    var eventName = subject.match(/Event Update\s+(.+)/)?.[1] || "Unknown Event";
    var time = body.match(/Time\s*:\s*(\d+ \w+ \d{4})/)?.[1] || "Unknown Time";

    // Create HTML email
    var htmlBody = `
      <h3>Event Details</h3>
      <ul>
        <li>Name: ${eventName}</li>
        <li>Time: ${time}</li>
      </ul>
      <p>Best regards,<br>Automation Team</p>
    `;

    // Send it
    MailApp.sendEmail({
      to: "team@example.com",
      subject: `Update - ${eventName}`,
      htmlBody: htmlBody
    });

    threads[i].addLabel(GmailApp.getUserLabelByName("done"));
  }
}
```

## Where It’s Useful

- **Team Coordination**: Forward updates or files to colleagues automatically.
- **Event Management**: Process responses and send confirmations easily.
- **Customer Service**: Pass along emails with attachments to the right team.
- **Data Tracking**: Collect info from emails and store it in a sheet.
- **Personal Use**: Set up notifications for important emails like reminders.

## How to Set It Up

1. **Get the Code**: Copy it from here and open it in Google Apps Script (`script.google.com`).
2. **Adjust It**: Change the filters or email addresses to fit your needs.
3. **Add a Trigger**: Use `ScriptApp.newTrigger()` to make it run regularly.
4. **Test It**: Run it manually first to check it works as expected.

## Tools I Used

- **Google Apps Script**: The main platform for this project.
- **GmailApp/MailApp**: For reading and sending emails.
- **SpreadsheetApp**: For logging actions in a sheet.
- **Regex**: To extract details from email text.
