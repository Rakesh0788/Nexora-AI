// ============================================================
// NEXORA AI - Resume Markdown Converter
// Converts structured ResumeFormData → Markdown string
// ============================================================

import type { ResumeFormValues } from "@/lib/schemas";

/**
 * Converts the resume form data object into a clean Markdown string
 * suitable for display, storage, and PDF generation.
 */
export function resumeToMarkdown(data: ResumeFormValues): string {
  const { contactInfo, summary, skills, experience, education, projects } =
    data;

  const lines: string[] = [];

  // ── Header ──────────────────────────────────────────────
  lines.push(`# ${contactInfo.name}`);
  lines.push("");

  const contactParts: string[] = [];
  if (contactInfo.email) contactParts.push(`📧 ${contactInfo.email}`);
  if (contactInfo.phone) contactParts.push(`📱 ${contactInfo.phone}`);
  if (contactInfo.location) contactParts.push(`📍 ${contactInfo.location}`);
  if (contactInfo.linkedin)
    contactParts.push(`[LinkedIn](${contactInfo.linkedin})`);
  if (contactInfo.github)
    contactParts.push(`[GitHub](${contactInfo.github})`);
  if (contactInfo.portfolio)
    contactParts.push(`[Portfolio](${contactInfo.portfolio})`);

  if (contactParts.length > 0) {
    lines.push(contactParts.join(" · "));
    lines.push("");
  }

  // ── Summary ─────────────────────────────────────────────
  if (summary) {
    lines.push("## Professional Summary");
    lines.push("");
    lines.push(summary);
    lines.push("");
  }

  // ── Skills ──────────────────────────────────────────────
  if (skills) {
    lines.push("## Skills");
    lines.push("");
    const skillList = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    lines.push(skillList.join(" · "));
    lines.push("");
  }

  // ── Work Experience ─────────────────────────────────────
  if (experience && experience.length > 0) {
    lines.push("## Work Experience");
    lines.push("");

    experience.forEach((exp) => {
      const dateRange = exp.current
        ? `${exp.startDate} – Present`
        : `${exp.startDate} – ${exp.endDate || "Present"}`;

      lines.push(`### ${exp.title} — ${exp.company}`);
      const subLine: string[] = [dateRange];
      if (exp.location) subLine.push(exp.location);
      lines.push(`*${subLine.join(" · ")}*`);
      lines.push("");

      if (exp.description) {
        // If description has bullet points, keep them; otherwise wrap in one bullet
        const desc = exp.description.trim();
        if (desc.startsWith("-") || desc.startsWith("•")) {
          lines.push(desc);
        } else {
          // Split by newlines and add bullets
          const bullets = desc
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean)
            .map((l) => (l.startsWith("-") ? l : `- ${l}`))
            .join("\n");
          lines.push(bullets);
        }
        lines.push("");
      }
    });
  }

  // ── Education ───────────────────────────────────────────
  if (education && education.length > 0) {
    lines.push("## Education");
    lines.push("");

    education.forEach((edu) => {
      lines.push(`### ${edu.degree}`);
      const subLine: string[] = [edu.institution];
      if (edu.location) subLine.push(edu.location);
      const dateRange =
        edu.startDate && edu.endDate
          ? `${edu.startDate} – ${edu.endDate}`
          : edu.startDate;
      if (dateRange) subLine.push(dateRange);
      lines.push(`*${subLine.join(" · ")}*`);

      if (edu.gpa) {
        lines.push(`GPA: ${edu.gpa}`);
      }
      if (edu.achievements) {
        lines.push("");
        lines.push(edu.achievements);
      }
      lines.push("");
    });
  }

  // ── Projects ────────────────────────────────────────────
  if (projects && projects.length > 0) {
    lines.push("## Projects");
    lines.push("");

    projects.forEach((proj) => {
      let title = `### ${proj.name}`;
      const links: string[] = [];
      if (proj.url) links.push(`[Live](${proj.url})`);
      if (proj.github) links.push(`[GitHub](${proj.github})`);
      if (links.length) title += ` · ${links.join(" · ")}`;

      lines.push(title);
      lines.push(`*${proj.technologies}*`);
      lines.push("");
      lines.push(proj.description);
      lines.push("");
    });
  }

  return lines.join("\n");
}

/**
 * Parses a markdown resume string back into a preview-friendly
 * structure (used for display purposes only).
 */
export function getResumePreviewText(markdown: string): string {
  return markdown;
}