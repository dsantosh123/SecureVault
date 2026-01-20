// lib/admin/validation.ts
// Document Validation Helpers for Death Certificates & Legal Documents

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface DocumentMetadata {
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  checksum?: string;
}

/**
 * Validate file type
 */
export function validateFileType(
  fileType: string,
  allowedTypes: string[] = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!allowedTypes.includes(fileType.toLowerCase())) {
    errors.push(
      `Invalid file type: ${fileType}. Allowed types: ${allowedTypes.join(', ')}`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate file size
 */
export function validateFileSize(
  fileSize: number,
  maxSizeMB: number = 10
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (fileSize > maxSizeBytes) {
    errors.push(
      `File size ${formatFileSize(fileSize)} exceeds maximum allowed size of ${maxSizeMB}MB`
    );
  }

  if (fileSize < 10 * 1024) {
    // Less than 10KB
    warnings.push(
      `File size ${formatFileSize(fileSize)} is unusually small. Please verify the document is complete.`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Validate death certificate fields
 */
export interface DeathCertificateData {
  deceasedName?: string;
  dateOfDeath?: string;
  placeOfDeath?: string;
  certificateNumber?: string;
  issuingAuthority?: string;
  issueDate?: string;
}

export function validateDeathCertificate(
  data: DeathCertificateData
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!data.deceasedName || data.deceasedName.trim().length < 3) {
    errors.push('Deceased name is required and must be at least 3 characters');
  }

  if (!data.dateOfDeath) {
    errors.push('Date of death is required');
  } else {
    const deathDate = new Date(data.dateOfDeath);
    const now = new Date();

    if (isNaN(deathDate.getTime())) {
      errors.push('Invalid date of death format');
    } else if (deathDate > now) {
      errors.push('Date of death cannot be in the future');
    } else {
      const daysDiff = Math.floor(
        (now.getTime() - deathDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff > 365 * 5) {
        // More than 5 years ago
        warnings.push(
          `Death occurred over ${Math.floor(daysDiff / 365)} years ago. Please verify certificate is still valid.`
        );
      }

      if (daysDiff < 7) {
        // Less than a week ago
        warnings.push('Death occurred very recently. Verify certificate authenticity.');
      }
    }
  }

  if (!data.certificateNumber) {
    warnings.push('Certificate number not provided. This may be required for verification.');
  }

  if (!data.issuingAuthority) {
    warnings.push('Issuing authority not specified. Verify legitimacy manually.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate name matching between nominee and expected name
 */
export function validateNameMatch(
  enteredName: string,
  expectedName: string,
  threshold: number = 0.8
): {
  match: boolean;
  similarity: number;
  reason?: string;
} {
  // Normalize names
  const normalize = (name: string) =>
    name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s]/g, '');

  const normalizedEntered = normalize(enteredName);
  const normalizedExpected = normalize(expectedName);

  // Exact match
  if (normalizedEntered === normalizedExpected) {
    return { match: true, similarity: 1.0 };
  }

  // Calculate similarity using Levenshtein distance
  const similarity = calculateStringSimilarity(normalizedEntered, normalizedExpected);

  if (similarity >= threshold) {
    return {
      match: true,
      similarity,
      reason: 'Name match (minor differences in formatting)',
    };
  }

  return {
    match: false,
    similarity,
    reason: `Names do not match sufficiently (${(similarity * 100).toFixed(0)}% similarity)`,
  };
}

/**
 * Calculate string similarity (Levenshtein distance based)
 */
function calculateStringSimilarity(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;

  if (len1 === 0) return len2 === 0 ? 1 : 0;
  if (len2 === 0) return 0;

  const matrix: number[][] = Array(len1 + 1)
    .fill(null)
    .map(() => Array(len2 + 1).fill(0));

  for (let i = 0; i <= len1; i++) matrix[i][0] = i;
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  const maxLen = Math.max(len1, len2);
  const distance = matrix[len1][len2];
  return 1 - distance / maxLen;
}

/**
 * Validate document age
 */
export function validateDocumentAge(
  uploadDate: string,
  maxAgeDays: number = 90
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const upload = new Date(uploadDate);
  const now = new Date();

  if (isNaN(upload.getTime())) {
    errors.push('Invalid upload date');
    return { isValid: false, errors, warnings };
  }

  const ageDays = Math.floor((now.getTime() - upload.getTime()) / (1000 * 60 * 60 * 24));

  if (ageDays > maxAgeDays) {
    errors.push(
      `Document was uploaded ${ageDays} days ago, exceeding the maximum age of ${maxAgeDays} days`
    );
  }

  if (ageDays > maxAgeDays * 0.8) {
    warnings.push(
      `Document is ${ageDays} days old. Consider requesting a fresh upload.`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Check for duplicate verification requests
 */
export interface VerificationRequest {
  id: string;
  nomineeEmail: string;
  userId: string;
  assetId: string;
  submittedAt: string;
  status: string;
}

export function checkDuplicateVerification(
  currentRequest: VerificationRequest,
  existingRequests: VerificationRequest[]
): {
  isDuplicate: boolean;
  duplicates: VerificationRequest[];
  reason?: string;
} {
  const duplicates = existingRequests.filter(req => {
    // Same nominee, user, and asset
    if (
      req.nomineeEmail === currentRequest.nomineeEmail &&
      req.userId === currentRequest.userId &&
      req.assetId === currentRequest.assetId &&
      req.id !== currentRequest.id
    ) {
      // Check if request is still active
      if (req.status === 'PENDING' || req.status === 'APPROVED') {
        return true;
      }
    }
    return false;
  });

  if (duplicates.length > 0) {
    return {
      isDuplicate: true,
      duplicates,
      reason: `Found ${duplicates.length} duplicate verification request(s) for this nominee and asset`,
    };
  }

  return {
    isDuplicate: false,
    duplicates: [],
  };
}

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    errors.push('Invalid email format');
  }

  // Check for common typos
  const commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
  const domain = email.split('@')[1];

  if (domain && !commonDomains.includes(domain)) {
    const similarDomain = commonDomains.find(
      d => calculateStringSimilarity(domain, d) > 0.8
    );

    if (similarDomain) {
      warnings.push(`Did you mean ${similarDomain} instead of ${domain}?`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate phone number
 */
export function validatePhoneNumber(phone: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Remove common formatting
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');

  // Check if it contains only digits and optional +
  if (!/^\+?\d+$/.test(cleaned)) {
    errors.push('Phone number should only contain digits, spaces, and optional + prefix');
  }

  // Check length (international format)
  if (cleaned.length < 10 || cleaned.length > 15) {
    warnings.push(
      'Phone number length is unusual. Please verify it is complete and correct.'
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Comprehensive document validation
 */
export function validateDocument(
  metadata: DocumentMetadata,
  certificateData?: DeathCertificateData
): ValidationResult {
  const results: ValidationResult[] = [];

  // File type validation
  results.push(validateFileType(metadata.fileType));

  // File size validation
  results.push(validateFileSize(metadata.fileSize));

  // Document age validation
  results.push(validateDocumentAge(metadata.uploadedAt));

  // Certificate data validation (if provided)
  if (certificateData) {
    results.push(validateDeathCertificate(certificateData));
  }

  // Combine all results
  const allErrors = results.flatMap(r => r.errors);
  const allWarnings = results.flatMap(r => r.warnings);

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };
}

/**
 * Get validation summary for display
 */
export function getValidationSummary(result: ValidationResult): string {
  if (result.isValid && result.warnings.length === 0) {
    return '✅ Validation passed';
  }

  if (result.isValid && result.warnings.length > 0) {
    return `⚠️ Validation passed with ${result.warnings.length} warning(s)`;
  }

  return `❌ Validation failed with ${result.errors.length} error(s)`;
}