/**
 * Template structure enforcement for markdown files
 * Ensures all game files follow a consistent structure
 */

import fs from 'fs';
import matter from 'gray-matter';
import type { TemplateStructure, ValidationError } from './types';

/**
 * Extract markdown section headers from content
 * @param content - Markdown content
 * @returns Array of header texts
 */
export function extractSectionHeaders(content: string): string[] {
  const headerRegex = /^#{1,6}\s+(.+)$/gm;
  const headers: string[] = [];
  let match;

  while ((match = headerRegex.exec(content)) !== null) {
    headers.push(match[1].trim());
  }

  return headers;
}

/**
 * Get all keys from a nested object (including nested paths)
 * @param obj - Object to extract keys from
 * @param prefix - Prefix for nested keys
 * @returns Array of key paths
 */
function getObjectKeys(obj: unknown, prefix = ''): string[] {
  if (typeof obj !== 'object' || obj === null) {
    return [];
  }

  const keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    keys.push(fullKey);

    // Recursively get nested keys for objects (but not arrays)
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...getObjectKeys(value, fullKey));
    }
  }

  return keys;
}

/**
 * Load template structure from a markdown file
 * @param templatePath - Path to the template file
 * @returns Template structure metadata
 * @throws Error if template file cannot be read
 */
export function loadTemplateStructure(templatePath: string): TemplateStructure {
  let fileContents: string;
  try {
    fileContents = fs.readFileSync(templatePath, 'utf8');
  } catch (error) {
    throw new Error(
      `Failed to read template file ${templatePath}: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  // Parse the template file
  let parsed: matter.GrayMatterFile<string>;
  try {
    parsed = matter(fileContents);
  } catch (error) {
    throw new Error(
      `Failed to parse template file ${templatePath}: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  // Extract structure
  const frontmatterKeys = getObjectKeys(parsed.data);
  const sectionHeaders = extractSectionHeaders(parsed.content);

  return {
    requiredFields: frontmatterKeys,
    frontmatterSchema: parsed.data,
    sectionHeaders,
  };
}

/**
 * Validate a file against a template structure
 * @param filePath - Path to file to validate
 * @param template - Template structure to validate against
 * @returns Array of validation errors (empty if valid)
 */
export function validateAgainstTemplate(filePath: string, template: TemplateStructure): ValidationError[] {
  const errors: ValidationError[] = [];

  // Read the file
  let fileContents: string;
  try {
    fileContents = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    errors.push({
      message: `Failed to read file: ${error instanceof Error ? error.message : String(error)}`,
    });
    return errors;
  }

  // Parse the file
  let parsed: matter.GrayMatterFile<string>;
  try {
    parsed = matter(fileContents);
  } catch (error) {
    errors.push({
      message: `Failed to parse file: ${error instanceof Error ? error.message : String(error)}`,
    });
    return errors;
  }

  // Validate frontmatter fields
  const fileKeys = getObjectKeys(parsed.data);
  const fileKeysSet = new Set(fileKeys);

  // Check for missing required fields
  for (const requiredField of template.requiredFields) {
    if (!fileKeysSet.has(requiredField)) {
      errors.push({
        field: requiredField,
        message: `Missing required frontmatter field: ${requiredField}`,
        path: requiredField.split('.'),
      });
    }
  }

  // Check for extra fields (optional warning)
  const templateKeysSet = new Set(template.requiredFields);
  for (const fileKey of fileKeys) {
    if (!templateKeysSet.has(fileKey)) {
      // This is just a warning, not a critical error
      // We'll still add it but mark it differently
      errors.push({
        field: fileKey,
        message: `Extra frontmatter field not in template: ${fileKey}`,
        path: fileKey.split('.'),
      });
    }
  }

  // Validate section headers
  const fileSectionHeaders = extractSectionHeaders(parsed.content);
  const fileSectionHeadersSet = new Set(fileSectionHeaders);

  // Check for missing section headers
  for (const requiredHeader of template.sectionHeaders) {
    if (!fileSectionHeadersSet.has(requiredHeader)) {
      errors.push({
        field: 'content',
        message: `Missing required section header: "${requiredHeader}"`,
      });
    }
  }

  return errors;
}

/**
 * Validate multiple files against a template
 * @param filePaths - Array of file paths to validate
 * @param template - Template structure to validate against
 * @returns Map of file paths to validation errors
 */
export function validateFilesAgainstTemplate(
  filePaths: string[],
  template: TemplateStructure
): Map<string, ValidationError[]> {
  const results = new Map<string, ValidationError[]>();

  for (const filePath of filePaths) {
    const errors = validateAgainstTemplate(filePath, template);
    if (errors.length > 0) {
      results.set(filePath, errors);
    }
  }

  return results;
}

/**
 * Load template from first file in directory and validate all others
 * @param directoryPath - Directory containing markdown files
 * @param templateFileName - Optional specific template file name
 * @returns Validation results for all files
 */
export function validateDirectoryWithTemplate(
  directoryPath: string,
  templateFileName?: string
): Map<string, ValidationError[]> {
  // Get all markdown files
  let files: string[];
  try {
    const allFiles = fs.readdirSync(directoryPath);
    files = allFiles.filter((f) => f.endsWith('.md')).map((f) => `${directoryPath}/${f}`);
  } catch (error) {
    const errorMap = new Map<string, ValidationError[]>();
    errorMap.set(directoryPath, [
      {
        message: `Failed to read directory: ${error instanceof Error ? error.message : String(error)}`,
      },
    ]);
    return errorMap;
  }

  if (files.length === 0) {
    return new Map();
  }

  // Determine template file
  let templatePath: string;
  if (templateFileName) {
    templatePath = `${directoryPath}/${templateFileName}`;
    if (!fs.existsSync(templatePath)) {
      const errorMap = new Map<string, ValidationError[]>();
      errorMap.set(directoryPath, [
        {
          message: `Template file not found: ${templateFileName}`,
        },
      ]);
      return errorMap;
    }
  } else {
    // Use first file as template
    templatePath = files[0];
  }

  // Load template structure
  let template: TemplateStructure;
  try {
    template = loadTemplateStructure(templatePath);
  } catch (error) {
    const errorMap = new Map<string, ValidationError[]>();
    errorMap.set(templatePath, [
      {
        message: `Failed to load template: ${error instanceof Error ? error.message : String(error)}`,
      },
    ]);
    return errorMap;
  }

  // Validate all files (excluding the template file itself)
  const filesToValidate = files.filter((f) => f !== templatePath);
  return validateFilesAgainstTemplate(filesToValidate, template);
}

/**
 * Format template validation errors for display
 * @param validationResults - Map of file paths to errors
 * @returns Formatted error report
 */
export function formatTemplateValidationErrors(validationResults: Map<string, ValidationError[]>): string {
  if (validationResults.size === 0) {
    return 'All files match the template structure ✓';
  }

  const lines: string[] = ['Template validation errors found:\n'];

  for (const [filePath, errors] of validationResults) {
    lines.push(`\n${filePath}:`);
    for (const error of errors) {
      const fieldInfo = error.field ? `[${error.field}] ` : '';
      lines.push(`  - ${fieldInfo}${error.message}`);
    }
  }

  return lines.join('\n');
}

/**
 * Check if two objects have the same structure (keys)
 * @param obj1 - First object
 * @param obj2 - Second object
 * @returns True if structures match
 */
export function haveSameStructure(obj1: unknown, obj2: unknown): boolean {
  const keys1 = getObjectKeys(obj1).sort();
  const keys2 = getObjectKeys(obj2).sort();

  if (keys1.length !== keys2.length) {
    return false;
  }

  return keys1.every((key, index) => key === keys2[index]);
}
