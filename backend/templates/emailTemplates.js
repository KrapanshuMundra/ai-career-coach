/**
 * Generates the HTML email for the Career Readiness Report
 * @param {Object} report   - AI-generated report { overallScore, breakdown, strengths, improvements, hiringRecommendation }
 * @param {string} atsScore - ATS resume score (number or "N/A")
 * @returns {string}        - Compiled HTML string
 */
export const generateInterviewReportTemplate = (report, atsScore) => {
  const atsNum  = Number(atsScore);
  const atsValid = !isNaN(atsNum);

  // Colour helpers
  const scoreColor = (n) => {
    if (n >= 85) return "#16a34a";
    if (n >= 71) return "#d97706";
    if (n >= 56) return "#ea580c";
    return "#dc2626";
  };

  const atsColor       = atsValid ? scoreColor(atsNum)              : "#6b7280";
  const interviewColor = scoreColor(report.overallScore ?? 0);

  // Hiring recommendation pill colour
  const rec   = (report.hiringRecommendation || "").toLowerCase();
  let recBg   = "#f3f4f6"; let recText = "#374151";
  if (rec.startsWith("strong hire") || rec.startsWith("hire"))
    { recBg = "#dcfce7"; recText = "#166534"; }
  else if (rec.startsWith("consider"))
    { recBg = "#fef9c3"; recText = "#854d0e"; }
  else if (rec.startsWith("no hire") || rec.startsWith("reject"))
    { recBg = "#fee2e2"; recText = "#991b1b"; }

  // Breakdown bars (only render if breakdown exists)
  const bd = report.breakdown || {};
  const dimensions = [
    { label: "Technical Accuracy",    score: bd.technicalAccuracy    },
    { label: "Communication Clarity", score: bd.communicationClarity },
    { label: "Specificity",           score: bd.specificity          },
    { label: "Problem-Solving",       score: bd.problemSolving       },
    { label: "Role Alignment",        score: bd.roleAlignment        },
  ].filter(d => d.score !== undefined);

  const barColor = (n) => {
    if (n >= 17) return "#16a34a";
    if (n >= 14) return "#d97706";
    if (n >= 10) return "#ea580c";
    return "#dc2626";
  };

  const renderBar = ({ label, score }) => `
    <tr>
      <td style="padding: 6px 0; width: 160px;">
        <span style="font-size:13px; color:#374151; font-weight:600;">${label}</span>
      </td>
      <td style="padding: 6px 0; padding-left: 16px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="background:#f3f4f6; border-radius:99px; height:7px; overflow:hidden;">
              <div style="width:${(score/20)*100}%; height:7px; background:${barColor(score)}; border-radius:99px;"></div>
            </td>
            <td style="width:36px; text-align:right; padding-left:10px;">
              <span style="font-size:12px; font-weight:800; color:${barColor(score)};">${score}<span style="color:#9ca3af; font-weight:600;">/20</span></span>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;

  const renderList = (items, emoji) =>
    (items || []).map(item => `
      <tr>
        <td style="padding: 8px 0; vertical-align:top; width:24px; font-size:15px;">${emoji}</td>
        <td style="padding: 8px 0 8px 8px; font-size:14px; color:#374151; line-height:1.6; font-weight:500;">${item}</td>
      </tr>`).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CareerCoach Report</title>
</head>
<body style="margin:0; padding:0; background:#f4f4f5; font-family:'Inter',Helvetica,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5; padding: 40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:20px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.07); max-width:600px; width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#6A0DAD 0%,#9D4EDD 100%); padding:40px 40px 36px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="margin:0 0 4px; font-size:22px; font-weight:900; color:#ffffff; letter-spacing:-0.5px;">CareerCoach</p>
                  <p style="margin:0; font-size:13px; color:#e9d5ff; font-weight:500;">AI Career Readiness Report</p>
                </td>
                <td align="right">
                  <div style="background:rgba(255,255,255,0.15); border-radius:12px; padding:10px 18px; display:inline-block;">
                    <p style="margin:0; font-size:11px; color:#e9d5ff; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Interview Score</p>
                    <p style="margin:4px 0 0; font-size:32px; font-weight:900; color:#ffffff; line-height:1;">${report.overallScore ?? "—"}<span style="font-size:14px; color:rgba(255,255,255,0.6); font-weight:600;">/100</span></p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Score cards row -->
        <tr>
          <td style="padding: 32px 40px 0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <!-- ATS Score -->
                <td width="48%" style="background:#f9fafb; border:1px solid #f3f4f6; border-radius:16px; padding:24px; text-align:center;">
                  <p style="margin:0 0 8px; font-size:11px; font-weight:800; color:#9ca3af; text-transform:uppercase; letter-spacing:1px;">ATS Resume Score</p>
                  <p style="margin:0; font-size:40px; font-weight:900; color:${atsColor}; line-height:1;">
                    ${atsScore}<span style="font-size:16px; color:#d1d5db; font-weight:700;">${atsValid ? "/100" : ""}</span>
                  </p>
                </td>
                <td width="4%"></td>
                <!-- Interview Score -->
                <td width="48%" style="background:#f9fafb; border:1px solid #f3f4f6; border-radius:16px; padding:24px; text-align:center;">
                  <p style="margin:0 0 8px; font-size:11px; font-weight:800; color:#9ca3af; text-transform:uppercase; letter-spacing:1px;">Interview Score</p>
                  <p style="margin:0; font-size:40px; font-weight:900; color:${interviewColor}; line-height:1;">
                    ${report.overallScore ?? "—"}<span style="font-size:16px; color:#d1d5db; font-weight:700;">/100</span>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        ${dimensions.length > 0 ? `
        <!-- Score Breakdown -->
        <tr>
          <td style="padding: 28px 40px 0;">
            <p style="margin:0 0 14px; font-size:11px; font-weight:800; color:#9ca3af; text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid #f3f4f6; padding-bottom:10px;">Performance Breakdown</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${dimensions.map(renderBar).join("")}
            </table>
          </td>
        </tr>` : ""}

        ${report.hiringRecommendation ? `
        <!-- Hiring Recommendation -->
        <tr>
          <td style="padding: 28px 40px 0;">
            <p style="margin:0 0 10px; font-size:11px; font-weight:800; color:#9ca3af; text-transform:uppercase; letter-spacing:1px;">Hiring Recommendation</p>
            <div style="background:${recBg}; border-radius:12px; padding:14px 18px;">
              <p style="margin:0; font-size:14px; font-weight:600; color:${recText}; line-height:1.6;">${report.hiringRecommendation}</p>
            </div>
          </td>
        </tr>` : ""}

        <!-- Strengths -->
        <tr>
          <td style="padding: 28px 40px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:16px; overflow:hidden;">
              <tr>
                <td style="padding:20px 24px 4px;">
                  <p style="margin:0; font-size:14px; font-weight:800; color:#166534;">✅ &nbsp;Top Strengths</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 4px 24px 20px;">
                  <table cellpadding="0" cellspacing="0" width="100%">
                    ${renderList(report.strengths, "✅")}
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Improvements -->
        <tr>
          <td style="padding: 16px 40px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff7ed; border:1px solid #fed7aa; border-radius:16px; overflow:hidden;">
              <tr>
                <td style="padding:20px 24px 4px;">
                  <p style="margin:0; font-size:14px; font-weight:800; color:#9a3412;">💡 &nbsp;Areas to Improve</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 4px 24px 20px;">
                  <table cellpadding="0" cellspacing="0" width="100%">
                    ${renderList(report.improvements, "💡")}
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="padding: 36px 40px;" align="center">
            <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard"
               style="display:inline-block; background:#6A0DAD; color:#ffffff; padding:16px 36px; text-decoration:none; border-radius:12px; font-weight:700; font-size:15px; letter-spacing:-0.2px;">
              View Full Dashboard →
            </a>
            <p style="margin:16px 0 0; font-size:12px; color:#9ca3af; font-weight:500;">
              Or paste this link: ${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#fafafa; border-top:1px solid #f3f4f6; padding:20px 40px; text-align:center;">
            <p style="margin:0; font-size:12px; color:#9ca3af; font-weight:500;">
              Automated report generated by <strong style="color:#6A0DAD;">CareerCoach AI</strong> · You're receiving this because you completed a mock interview session.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;
};