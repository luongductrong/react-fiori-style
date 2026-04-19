import { formatFileSize } from '@/libs/utils';
import { MAX_FILE_SIZE } from '@/app-constant';
import { findInvalidMimeTypes, normalizeMimeTypeToken } from './mime-types';

type ConfigFileMimeTypesValidation = {
  error: string;
  invalidMimeTypes: string[];
};

type ConfigFileFormValidation = {
  fileExt: string;
  mimeTypes: ConfigFileMimeTypesValidation;
  maxBytes: string;
  description: string;
};

const EMPTY_CONFIG_FILE_FORM_VALIDATION: ConfigFileFormValidation = {
  fileExt: '',
  mimeTypes: {
    error: '',
    invalidMimeTypes: [],
  },
  maxBytes: '',
  description: '',
};

type ConfigFileValidationInput = {
  fileExt: string;
  mimeTypes: string[];
  maxBytes: string;
  description: string;
};

function validateConfigFileExtension(value: string) {
  const normalizedValue = value.trim().replace(/^\./, '');

  if (!normalizedValue) {
    return 'File extension cannot be empty.';
  }

  return '';
}

function validateConfigFileMimeTypes(values: string[]): ConfigFileMimeTypesValidation {
  const normalizedValues = values.map(normalizeMimeTypeToken).filter(Boolean);

  if (normalizedValues.length === 0) {
    return {
      error: 'At least one MIME type is required.',
      invalidMimeTypes: [],
    };
  }

  const invalidMimeTypes = findInvalidMimeTypes(normalizedValues);

  if (invalidMimeTypes.length > 0) {
    return {
      error: `Invalid MIME types: ${invalidMimeTypes.join(', ')}.`,
      invalidMimeTypes,
    };
  }

  return {
    error: '',
    invalidMimeTypes: [],
  };
}

function validateConfigFileMaxBytes(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return 'Max bytes cannot be empty.';
  }

  const maxBytes = Number(trimmedValue);

  if (!Number.isFinite(maxBytes)) {
    return 'Max bytes must be a valid number.';
  }

  if (maxBytes <= 0) {
    return 'Max bytes must be greater than 0.';
  }

  if (maxBytes > MAX_FILE_SIZE) {
    return `Max bytes cannot exceed the system limit of ${formatFileSize(MAX_FILE_SIZE)}.`;
  }

  return '';
}

function validateConfigFileDescription(value: string) {
  if (!value.trim()) {
    return 'Description cannot be empty.';
  }

  return '';
}

function validateConfigFileForm(values: ConfigFileValidationInput): ConfigFileFormValidation {
  return {
    fileExt: validateConfigFileExtension(values.fileExt),
    mimeTypes: validateConfigFileMimeTypes(values.mimeTypes),
    maxBytes: validateConfigFileMaxBytes(values.maxBytes),
    description: validateConfigFileDescription(values.description),
  };
}

export { validateConfigFileForm };
export type { ConfigFileFormValidation };
export { EMPTY_CONFIG_FILE_FORM_VALIDATION };

/**
 * Validation rules for Config File form:
 *
 * - fileExt:
 *   + Must not be empty
 *   + Leading dot (.) is optional and will be removed before validation
 *
 * - mimeTypes:
 *   + At least one MIME type is required
 *   + Each MIME type is normalized before validation
 *   + Must follow valid MIME format (type/subtype)
 *   + Returns list of invalid MIME types if any
 *
 * - maxBytes:
 *   + Must not be empty
 *   + Must be a valid finite number
 *   + Must be greater than 0
 *   + Must not exceed MAX_FILE_SIZE system limit
 *
 * - description:
 *   + Must not be empty (after trimming)
 *
 * - validateConfigFileForm:
 *   + Aggregates all field validations into a single result object
 */
