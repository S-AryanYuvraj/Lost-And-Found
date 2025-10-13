// Simple input sanitizer to prevent HTML injection
exports.sanitize = (txt = '') =>
  txt.replace(/[<>]/g, (m) => (m === '<' ? '&lt;' : '&gt;'));
