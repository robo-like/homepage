export default function generateEmailTemplate(
  origin: string,
  magicLinkUrl: string
): string {
  const colors = ["#D0021B", "#7B001C", "#FF007F", "#3D0070", "#FF4500"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RoboLike Magic Link</title>
    <!-- Include styles in the head for clients that support it -->
    <style type="text/css">
      /* Base styles */
      body, table, td, p, a, li, blockquote {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333333;
      }
      table {
        border-spacing: 0;
        border-collapse: collapse;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }
      img {
        border: 0;
        height: auto;
        line-height: 100%;
        outline: none;
        text-decoration: none;
        -ms-interpolation-mode: bicubic;
      }
      /* Fallback styles for Outlook and other clients that ignore CSS */
      .button-fallback {
        background-color: ${randomColor};
        border: solid 1px ${randomColor};
        border-radius: 4px;
        color: #ffffff !important;
        display: inline-block;
        font-size: 16px;
        font-family: Arial, sans-serif;
        font-weight: bold;
        line-height: 40px;
        text-align: center;
        text-decoration: none;
        width: 150px;
        -webkit-text-size-adjust: none;
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: Arial, sans-serif; line-height: 1.6; color: #333333;">
    <!-- Wrapper table for better email client compatibility -->
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding: 20px 0;">
          <!-- Content table with max width -->
          <table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto;">
            <tr>
              <td style="padding: 20px;">
                <!-- Logo -->
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td>
                      <img src="${origin}/heart.png" alt="RoboLike Logo" width="150" height="auto" style="display: block; max-width: 150px;">
                    </td>
                  </tr>
                </table>
                
                <!-- Heading -->
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding: 20px 0 10px 0; font-size: 24px; font-weight: bold;">
                      Your Magic Link
                    </td>
                  </tr>
                </table>
                
                <!-- Main Content -->
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding: 0 0 20px 0;">
                      Click the button below to log in to your RoboLike account. This link will expire in 5 minutes.
                    </td>
                  </tr>
                </table>
                
                <!-- Button -->
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding: 0 0 20px 0;">
                      <!-- Using both table-based button AND CSS class button for maximum compatibility -->
                      <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td align="center" bgcolor="${randomColor}" style="border-radius: 4px;">
                            <!--[if mso]>
                            <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${magicLinkUrl}" style="height:40px;v-text-anchor:middle;width:150px;" arcsize="10%" stroke="f" fillcolor="${randomColor}">
                              <w:anchorlock/>
                              <center>
                            <![endif]-->
                            <a href="${magicLinkUrl}" target="_blank" class="button-fallback" style="background-color: ${randomColor}; border: 1px solid ${randomColor}; border-radius: 4px; color: #ffffff; display: inline-block; font-size: 16px; font-weight: bold; line-height: 40px; text-align: center; text-decoration: none; width: 150px; -webkit-text-size-adjust: none; mso-hide: all;">
                              Log In
                            </a>
                            <!--[if mso]>
                              </center>
                            </v:roundrect>
                            <![endif]-->
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                
                <!-- Footer Content -->
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding: 0 0 10px 0;">
                      If you did not request this link, you can safely ignore this email.
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 0 0 10px 0;">
                      - The RoboLike Team
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
