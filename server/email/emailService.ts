import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Email templates directory
const TEMPLATE_DIR = path.join(__dirname, "templates");

// Check if email credentials are configured
const isEmailConfigured = (): boolean => {
  return !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);
};

// Create a test account for development if no credentials provided
const createTestAccount = async () => {
  console.log("Creating test email account for development...");
  const testAccount = await nodemailer.createTestAccount();
  console.log("Test email account created:", testAccount.user);
  return {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  };
};

// Get email configuration
const getEmailConfig = async () => {
  if (isEmailConfigured()) {
    return {
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: Number.parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER || "",
        pass: process.env.EMAIL_PASS || "",
      },
    };
  } else {
    return await createTestAccount();
  }
};

// Create transporter (lazy initialization)
let transporter: nodemailer.Transporter | null = null;

// Initialize transporter
const getTransporter = async (): Promise<nodemailer.Transporter> => {
  if (!transporter) {
    const config = await getEmailConfig();
    transporter = nodemailer.createTransport(config);

    // Log configuration (without password)
    const logConfig = {
      ...config,
      auth: { user: config.auth.user, pass: "********" },
    };
    console.log("Email transport configured:", logConfig);
  }
  return transporter;
};

// Load template from file
const loadTemplate = (templateName: string): string => {
  try {
    const templatePath = path.join(TEMPLATE_DIR, `${templateName}.html`);
    if (fs.existsSync(templatePath)) {
      return fs.readFileSync(templatePath, "utf8");
    }

    // If template file doesn't exist, return a simple fallback template
    console.warn(
      `Template ${templateName}.html not found, using fallback template`
    );
    return getFallbackTemplate(templateName);
  } catch (error) {
    console.error(`Error loading email template ${templateName}:`, error);
    return getFallbackTemplate(templateName);
  }
};

// Fallback template when file is not found
const getFallbackTemplate = (templateName: string): string => {
  if (templateName === "welcome") {
    return `
      <html>
        <body>
          <h1>Welcome to Pixinity!</h1>
          <p>Hello {{firstName}},</p>
          <p>Thank you for joining Pixinity as a {{role}}. Your account has been created successfully.</p>
          <p>Your username: {{username}}</p>
          <p>Get started by exploring our platform and uploading your first photos!</p>
          <p>Best regards,<br>The Pixinity Team</p>
        </body>
      </html>
    `;
  } else if (templateName === "login-notification") {
    return `
      <html>
        <body>
          <h1>New Login to Your Pixinity Account</h1>
          <p>Hello {{firstName}},</p>
          <p>We detected a new login to your account:</p>
          <p>Time: {{loginTime}}<br>IP Address: {{ipAddress}}<br>Device: {{device}}</p>
          <p>If this wasn't you, please secure your account immediately.</p>
          <p>Best regards,<br>The Pixinity Security Team</p>
        </body>
      </html>
    `;
  } else {
    return `
      <html>
        <body>
          <h1>Pixinity Notification</h1>
          <p>This is an automated message from Pixinity.</p>
        </body>
      </html>
    `;
  }
};

// Replace placeholders in template
const replacePlaceholders = (
  template: string,
  data: Record<string, string>
): string => {
  let result = template;
  for (const [key, value] of Object.entries(data)) {
    result = result.replace(new RegExp(`{{${key}}}`, "g"), value);
  }
  return result;
};

// Send welcome email
export const sendWelcomeEmail = async (
  to: string,
  data: {
    firstName: string;
    username: string;
    role: string;
  }
): Promise<boolean> => {
  try {
    console.log(`Preparing welcome email to ${to}...`);

    // Load and prepare template
    let template = loadTemplate("welcome");

    // Replace placeholders
    template = replacePlaceholders(template, {
      firstName: data.firstName,
      username: data.username,
      role: data.role,
      currentYear: new Date().getFullYear().toString(),
    });

    // Get transporter
    const transport = await getTransporter();

    // Send email
    const info = await transport.sendMail({
      from: `"Pixinity Team" <${transport.options.auth?.user}>`,
      to,
      subject: "Welcome to Pixinity - Get Started with Your Account",
      html: template,
    });

    console.log(`Welcome email sent: ${info.messageId}`);

    // If using Ethereal, provide preview URL
    if (transport.options.host === "smtp.ethereal.email") {
      console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }

    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return false;
  }
};

// Send login notification
export const sendLoginNotificationEmail = async (
  to: string,
  data: {
    firstName: string;
    loginTime: string;
    ipAddress: string;
    device: string;
  }
): Promise<boolean> => {
  try {
    console.log(`Preparing login notification to ${to}...`);

    // Load and prepare template
    let template = loadTemplate("login-notification");

    // Replace placeholders
    template = replacePlaceholders(template, {
      firstName: data.firstName,
      loginTime: data.loginTime,
      ipAddress: data.ipAddress,
      device: data.device,
      currentYear: new Date().getFullYear().toString(),
    });

    // Get transporter
    const transport = await getTransporter();

    // Send email
    const info = await transport.sendMail({
      from: `"Pixinity Security" <${transport.options.auth?.user}>`,
      to,
      subject: "New Login to Your Pixinity Account",
      html: template,
    });

    console.log(`Login notification email sent: ${info.messageId}`);

    // If using Ethereal, provide preview URL
    if (transport.options.host === "smtp.ethereal.email") {
      console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }

    return true;
  } catch (error) {
    console.error("Error sending login notification email:", error);
    return false;
  }
};

// Verify email setup
export const verifyEmailSetup = async (): Promise<boolean> => {
  try {
    const transport = await getTransporter();
    await transport.verify();
    console.log("Email service is ready to send messages");
    return true;
  } catch (error) {
    console.error("Email service verification failed:", error);
    return false;
  }
};

export default {
  sendWelcomeEmail,
  sendLoginNotificationEmail,
  verifyEmailSetup,
};
