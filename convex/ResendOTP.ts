import { Email } from "@convex-dev/auth/providers/Email";
import { Resend as ResendAPI } from "resend";
import { RandomReader, generateRandomString } from "@oslojs/crypto/random";

export const ResendOTP = Email({
  id: "resend-otp",
  apiKey: process.env.AUTH_RESEND_KEY,
  maxAge: 60 * 15, // 15 minutes
  async generateVerificationToken() {
    const random: RandomReader = {
      read(bytes) {
        crypto.getRandomValues(bytes as Uint8Array<ArrayBuffer>);
      },
    };
    return generateRandomString(random, "0123456789", 6);
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    const resend = new ResendAPI(provider.apiKey);
    const { error } = await resend.emails.send({
      from: `Quizlr <${process.env.FROM_EMAIL ?? "onboarding@resend.dev"}>`,
      to: [email],
      subject: "Verify your Quizlr account",
      text: getOTPTextTemplate(token),
      html: getOTPHTMLTemplate(token)
    });
    if (error) {
      throw new Error(JSON.stringify(error));
    }
  },
});

function getOTPTextTemplate(otp: string) {
  return `Quizlr
==============================

Confirm your email address

Use the code below to verify your email and complete sign up.

Your verification code:

  ${otp}

This code expires in 15 minutes.

------------------------------
If you didn't request this, you can safely ignore this email.
© ${new Date().getFullYear()} Quizlr. All rights reserved.`;
}

function getOTPHTMLTemplate(otp: string) {
  return `<body style="word-spacing: normal; background-color: #fafafa; margin: 0; padding: 0;">
  <div style="
        display: none;
        font-size: 1px;
        color: #ffffff;
        line-height: 1px;
        max-height: 0px;
        max-width: 0px;
        opacity: 0;
        overflow: hidden;
      ">
    OTP for email confirmation
  </div>

  <!--[if !mso]><!-->
  <style>
    @media (prefers-color-scheme: dark) {
      .email-body { background-color: #111111 !important; }
      .email-card { background-color: #1c1c1c !important; background: #1c1c1c !important; }
      .email-heading { color: #f5f5f5 !important; }
      .email-subtext { color: #a3a3a3 !important; }
      .otp-box { background-color: #2a2a2a !important; }
      .otp-code { color: #f5f5f5 !important; }
      .otp-validity { color: #737373 !important; }
      .logo-main { color: #f5f5f5 !important; }
      .logo-muted { color: #737373 !important; }
    }
  </style>
  <!--<![endif]-->

  <div class="email-body" style="background-color: #fafafa">
    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%">
      <tbody>
        <tr>
          <td>
            <div style="margin: 0px auto; max-width: 600px">
              <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%">
                <tbody>
                  <tr>
                    <td style="direction: ltr; font-size: 0px; padding: 16px; text-align: center;">
                      <div class="email-card" style="
                            background: #ffffff;
                            background-color: #ffffff;
                            margin: 0px auto;
                            border-radius: 10px;
                            max-width: 568px;
                          ">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; border-radius: 10px;">
                          <tbody>
                            <tr>
                              <td style="direction: ltr; font-size: 0px; padding: 40px 32px 32px; text-align: center;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                  <tbody>

                                    <!-- Logo -->
                                    <tr>
                                      <td align="center" style="padding-bottom: 28px;">
                                        <div style="font-family: Arial, sans-serif; font-size: 26px; font-weight: 700; letter-spacing: -0.5px; line-height: 1;">
                                          <span class="logo-main" style="color: #171717;">Quiz</span><span class="logo-muted" style="color: #737373;">lr</span>
                                        </div>
                                      </td>
                                    </tr>

                                    <!-- Divider -->
                                    <tr>
                                      <td style="padding-bottom: 28px;">
                                        <div style="height: 1px; background-color: #e5e5e5; width: 100%;"></div>
                                      </td>
                                    </tr>

                                    <!-- Heading + subtext -->
                                    <tr>
                                      <td align="center" style="padding-bottom: 28px;">
                                        <h1 class="email-heading" style="
                                              font-family: Arial, sans-serif;
                                              font-size: 20px;
                                              font-weight: 700;
                                              color: #171717;
                                              margin: 0 0 10px 0;
                                              line-height: 1.3;
                                            ">
                                          Confirm your email address
                                        </h1>
                                        <p class="email-subtext" style="
                                              font-family: Arial, sans-serif;
                                              font-size: 14px;
                                              color: #737373;
                                              margin: 0;
                                              line-height: 1.5;
                                            ">
                                          Use the code below to verify your email and complete sign up.
                                        </p>
                                      </td>
                                    </tr>

                                    <!-- OTP Box -->
                                    <tr>
                                      <td align="center" style="padding-bottom: 24px;">
                                        <div class="otp-box" style="
                                              display: inline-block;
                                              background-color: #f5f5f5;
                                              border-radius: 8px;
                                              padding: 20px 40px;
                                            ">
                                          <p class="otp-code" style="
                                                font-family: 'Courier New', Courier, monospace;
                                                font-size: 36px;
                                                font-weight: 700;
                                                letter-spacing: 12px;
                                                color: #171717;
                                                margin: 0;
                                                padding: 0;
                                                padding-right: -12px;
                                                line-height: 1;
                                              ">
                                            ${otp}
                                          </p>
                                        </div>
                                      </td>
                                    </tr>

                                    <!-- Validity -->
                                    <tr>
                                      <td align="center">
                                        <p class="otp-validity" style="
                                              font-family: Arial, sans-serif;
                                              font-size: 13px;
                                              color: #a3a3a3;
                                              margin: 0;
                                            ">
                                          This code expires in <strong>15 minutes</strong>.
                                        </p>
                                      </td>
                                    </tr>

                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <!-- Footer -->
                      <div style="margin-top: 20px; padding: 0 8px;">
                        <p class="otp-validity" style="
                              font-family: Arial, sans-serif;
                              font-size: 12px;
                              color: #a3a3a3;
                              text-align: center;
                              margin: 0;
                              line-height: 1.6;
                            ">
                          If you didn't request this, you can safely ignore this email.<br/>
                          &copy; ${new Date().getFullYear()} Quizlr. All rights reserved.
                        </p>
                      </div>

                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</body>`;
}