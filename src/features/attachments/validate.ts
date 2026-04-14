const FILE_NAME_MAX_LENGTH = 255;
// Matches any invalid character in Windows file names.
// Includes reserved symbols: < > : " / \ | ? *
// and all control characters (ASCII 0–31), which are non-printable
// and can cause filesystem or security issues.
const INVALID_FILE_NAME_CHARS = /[<>:"/\\|?*\u0000-\u001F]/;
// Matches reserved Windows file names that cannot be used,
// even with extensions (e.g., "con", "nul", "com1", "lpt1").
// The check is case-insensitive and applies to the base name.
const RESERVED_WINDOWS_FILE_NAMES = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\..*)?$/i;

function validateFileName(fileName: string) {
  if (!fileName) {
    return 'File name cannot be empty.';
  }

  if (fileName !== fileName.trim()) {
    return 'File name cannot start or end with spaces.';
  }

  if (fileName === '.' || fileName === '..') {
    return 'File name cannot be "." or "..".';
  }

  if (fileName.endsWith('.')) {
    return 'File name cannot end with a period.';
  }

  if (fileName.length > FILE_NAME_MAX_LENGTH) {
    return `File name cannot exceed ${FILE_NAME_MAX_LENGTH} characters.`;
  }

  if (INVALID_FILE_NAME_CHARS.test(fileName)) {
    return 'File name contains invalid characters: < > : " / \\ | ? *';
  }

  if (RESERVED_WINDOWS_FILE_NAMES.test(fileName)) {
    return 'File name uses a reserved system name.';
  }

  return '';
}

export { validateFileName };

// TODO: All validate user input here
