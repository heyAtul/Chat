import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const APP_NAME = "Chat";

const otpTemplate = (otp) => `
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f2f5;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="background:#00a884;padding:20px 32px;color:#ffffff;font-size:20px;font-weight:bold;">
              ${APP_NAME}
            </td>
          </tr>
          <tr>
            <td style="padding:32px;color:#41525d;">
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:normal;color:#111b21;">Your login code</h1>
              <p style="margin:0 0 24px;font-size:15px;">Use this code to log in to ${APP_NAME}.</p>
              <div style="background:#d9fdd3;border-radius:8px;padding:16px;text-align:center;font-size:32px;font-weight:bold;letter-spacing:8px;color:#111b21;">
                ${otp}
              </div>
              <p style="margin:24px 0 0;font-size:13px;color:#667781;">
                You are receiving this because someone used this email to log in to ${APP_NAME}.
                If it wasn't you, you can ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f7f8fa;padding:16px 32px;font-size:12px;color:#8696a0;text-align:center;">
              Sent by ${APP_NAME}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
`;

export const sendOtpMail = async (to, otp) => {
  const { error } = await resend.emails.send({
    from: `${APP_NAME} <${process.env.MAIL_FROM}>`,
    to,
    subject: `Your ${APP_NAME} login code`,
    html: otpTemplate(otp),
  });

  if (error) throw new Error(error.message);
};
