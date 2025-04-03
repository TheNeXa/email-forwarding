// Configuration (customize these as needed)
const CONFIG = {
  labelToProcess: "toprocess",        // Label for emails to process
  labelProcessed: "processed",        // Label for processed emails
  senderEmail: "sender@example.com",  // Email sender to filter
  forwardTo: "recipient@example.com", // Where to send the formatted email
  ccEmail: "cc@example.com",          // CC recipient (optional)
  subjectPrefix: "Event Update",      // Subject line to search for
};

// Main function to process and forward emails
function processAndForwardEmails() {
  // Search for emails matching sender, subject, and labels
  const query = `from:${CONFIG.senderEmail} ${CONFIG.subjectPrefix} label:${CONFIG.labelToProcess} -label:${CONFIG.labelProcessed}`;
  const threads = GmailApp.search(query);

  for (let i = 0; i < threads.length; i++) {
    const messages = threads[i].getMessages();

    for (let j = 0; j < messages.length; j++) {
      const message = messages[j];
      const subject = message.getSubject();
      const body = message.getPlainBody();

      // Extract key info from subject (e.g., "Event Update EVENT_NAME")
      const nameMatch = subject.match(new RegExp(`${CONFIG.subjectPrefix}\\s+(.+)`));
      const eventName = nameMatch ? nameMatch[1] : "UNKNOWN EVENT";

      // Extract details from email body (customize regex as needed)
      const timeMatch = body.match(/Time\s*:\s*(\d+ \w+ \d{4} \/ \d{2}\.\d{2})/);
      const eventTime = timeMatch ? timeMatch[1] : "UNKNOWN TIME";

      const locationMatch = body.match(/Location\s*:\s*(.+)/);
      const location = locationMatch ? locationMatch[1].trim() : "UNKNOWN LOCATION";

      const extraMatch = body.match(/Extra\s*:\s*(.+)/);
      const extraInfo = extraMatch ? extraMatch[1].trim() : "NO EXTRA INFO";

      // Build HTML email body (customize structure/content)
      const htmlBody = `
<html>
  <body style="font-family: Arial, sans-serif; font-size: 12px; color: #333;">
    <p>Dear Team,</p>
    <p>Good day,</p>
    <p>Here’s the plan for <strong>${eventName}</strong>:</p>
    <hr style="border: 1px solid #ddd;">
    <h3>Details:</h3>
    <ul>
      <li>Name: ${eventName}</li>
      <li>Location: ${location}</li>
      <li>Time: ${eventTime}</li>
      <li>Extra Info: ${extraInfo}</li>
    </ul>
    <hr style="border: 1px solid #ddd;">
    <p>Best regards,<br>Your Automation Assistant</p>
  </body>
</html>
`;

      // Send the email
      MailApp.sendEmail({
        to: CONFIG.forwardTo,
        subject: `Plan - ${eventName}`,
        htmlBody: htmlBody,
        cc: CONFIG.ccEmail,
      });

      // Mark as processed
      const processedLabel = GmailApp.getUserLabelByName(CONFIG.labelProcessed) || GmailApp.createLabel(CONFIG.labelProcessed);
      threads[i].addLabel(processedLabel);
    }
  }
}

// Set up a trigger to run every 10 minutes (adjust interval as needed)
function setupTrigger() {
  ScriptApp.newTrigger("processAndForwardEmails")
    .timeBased()
    .everyMinutes(10)
    .create();
}