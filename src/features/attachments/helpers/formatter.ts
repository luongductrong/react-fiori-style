function displayAuditAction(action?: string) {
  switch (action) {
    case 'CREATE':
      return 'Create';
    case 'UPDATE_TITLE':
      return 'Update Title';
    case 'SET_CURRENT_VERSION':
      return 'Set Current Version';
    case 'DELETE':
      return 'Delete';
    case 'REACTIVATE':
      return 'Restore';
    case 'LINK_BO':
      return 'Link to Business Object';
    case 'UNLINK_BO':
      return 'Unlink from Business Object';
    case 'CREATE_VERSION':
      return 'Upload New Version';
    default:
      return action ? `"${action}"` : '-';
  }
}

function displayVersion(version?: string | number | null, fallback = '') {
  if (version === null || version === undefined) {
    return fallback;
  }

  const normalizedVersion = String(version).trim();

  if (!normalizedVersion) {
    return fallback;
  }
  // add leading zeros to version if it is a number
  return /^\d+$/.test(normalizedVersion) ? normalizedVersion.padStart(3, '0') : normalizedVersion;
}

export { displayAuditAction, displayVersion };
