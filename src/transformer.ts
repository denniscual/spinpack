/**
 * Transforms a given template string by converting specific patterns into RSPack EJS syntax.
 * It specifically looks for environment variable placeholders enclosed in percent signs and
 * template control structures within `<% %>` tags.
 *
 * The function replaces environment variable placeholders (e.g., %VAR_NAME%) with the
 * RSPack compatible embedded JavaScript syntax (<%= VAR_NAME %>), while leaving template
 * control logic unchanged.
 *
 * @param {string} template - The HTML or EJS template string to be transformed.
 * @returns {string} The transformed template with environment variables adjusted for RSPack.
 */
export function transformTemplateIntoRspackTemplate(template: string) {
  // Modify content by selectively replacing only the variables outside of template logic
  return template.replace(/<%.*?%>|%([A-Z0-9_]+)%/g, (match, p1) => {
    if (p1) {
      // This matches what we consider to be an environment variable pattern
      return `<%= ${p1} %>`;
    }
    // No change to templating logic or unmatched patterns
    return match;
  });
}
