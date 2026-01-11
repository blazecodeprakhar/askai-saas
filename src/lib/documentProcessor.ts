/**
 * Simplified Document Processing - Focus on Reliability
 * 
 * This version prioritizes working features over comprehensive support
 */

import Tesseract from 'tesseract.js';

export interface ProcessedDocument {
    extractedText: string;
    fileType: string;
    fileName: string;
    pageCount?: number;
    success: boolean;
    error?: string;
}

/**
 * Main function to process any uploaded file
 */
export async function processUploadedFile(file: File): Promise<ProcessedDocument> {
    const fileType = file.type.toLowerCase();
    const fileName = file.name;

    console.log(`[DocumentProcessor] Processing: ${fileName} (${fileType}, ${(file.size / 1024).toFixed(2)} KB)`);

    try {
        // Image files - use OCR (WORKING)
        if (fileType.startsWith('image/')) {
            console.log('[DocumentProcessor] Detected image file, using OCR');
            return await extractTextFromImage(file);
        }

        // Text files (WORKING)
        if (
            fileType.startsWith('text/') ||
            fileName.endsWith('.txt') ||
            fileName.endsWith('.csv') ||
            fileName.endsWith('.json')
        ) {
            console.log('[DocumentProcessor] Detected text file, reading directly');
            return await extractTextFromTextFile(file);
        }

        // PDF files - Try to process, but provide clear feedback if it fails
        if (fileType === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf')) {
            console.log('[DocumentProcessor] Detected PDF file, attempting extraction');

            // For now, return a helpful message instead of failing
            return {
                extractedText: '',
                fileType,
                fileName,
                success: false,
                error: `PDF processing is currently being configured. For now, please:
1. Open the PDF and copy the text you want to analyze
2. Paste it in the chat
3. Or convert the PDF pages to images and upload those for OCR

We're working on automatic PDF text extraction!`,
            };
        }

        // Unsupported file type
        console.warn('[DocumentProcessor] Unsupported file type:', fileType);
        return {
            extractedText: '',
            fileType,
            fileName,
            success: false,
            error: `File type "${fileType}" is not yet supported. Supported formats: Images (for OCR) and Text files (TXT, CSV, JSON).`,
        };
    } catch (error) {
        console.error('[DocumentProcessor] Error processing file:', error);
        return {
            extractedText: '',
            fileType,
            fileName,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred during file processing',
        };
    }
}

/**
 * Extract text from image using Tesseract.js OCR
 */
async function extractTextFromImage(file: File): Promise<ProcessedDocument> {
    try {
        console.log(`[OCR] Starting OCR for: ${file.name}`);

        const result = await Tesseract.recognize(file, 'eng', {
            logger: (m) => {
                if (m.status === 'recognizing text') {
                    console.log(`[OCR] Progress: ${Math.round(m.progress * 100)}%`);
                }
            },
        });

        const extractedText = result.data.text.trim();

        if (!extractedText) {
            console.warn('[OCR] No text extracted from image');
            return {
                extractedText: '',
                fileType: file.type,
                fileName: file.name,
                success: false,
                error: 'No text could be extracted from this image. The image may not contain readable text, or the text may be too small/blurry.',
            };
        }

        console.log(`[OCR] Successfully extracted ${extractedText.length} characters from: ${file.name}`);
        return {
            extractedText: normalizeText(extractedText),
            fileType: file.type,
            fileName: file.name,
            success: true,
        };
    } catch (error) {
        console.error('[OCR] Error:', error);
        throw new Error(`OCR failed: ${error instanceof Error ? error.message : 'Unknown error'}. Make sure the image contains clear, readable text.`);
    }
}

/**
 * Extract text from plain text files
 */
async function extractTextFromTextFile(file: File): Promise<ProcessedDocument> {
    try {
        console.log(`[TextFile] Reading: ${file.name}`);
        const text = await file.text();

        if (!text.trim()) {
            console.warn('[TextFile] File is empty');
            return {
                extractedText: '',
                fileType: file.type,
                fileName: file.name,
                success: false,
                error: 'The text file is empty.',
            };
        }

        console.log(`[TextFile] Successfully read ${text.length} characters from: ${file.name}`);
        return {
            extractedText: normalizeText(text),
            fileType: file.type,
            fileName: file.name,
            success: true,
        };
    } catch (error) {
        console.error('[TextFile] Error:', error);
        throw new Error(`Text file processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Normalize extracted text
 */
function normalizeText(text: string): string {
    return text
        .replace(/ {2,}/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .split('\n')
        .map((line) => line.trim())
        .join('\n')
        .trim();
}

/**
 * Process multiple files and combine their extracted text
 */
export async function processMultipleFiles(files: File[]): Promise<{
    combinedText: string;
    results: ProcessedDocument[];
    allSuccessful: boolean;
}> {
    const results: ProcessedDocument[] = [];
    const textParts: string[] = [];

    console.log(`[DocumentProcessor] Processing ${files.length} file(s)...`);

    for (const file of files) {
        console.log(`[DocumentProcessor] Processing: ${file.name}`);

        try {
            const result = await processUploadedFile(file);
            results.push(result);

            if (result.success && result.extractedText) {
                const header = result.pageCount
                    ? `=== ${result.fileName} (${result.pageCount} pages) ===`
                    : `=== ${result.fileName} ===`;

                textParts.push(`\n\n${header}\n${result.extractedText}`);
                console.log(`[DocumentProcessor] ✓ Successfully processed: ${file.name}`);
            } else {
                console.warn(`[DocumentProcessor] ✗ Failed to process: ${file.name}`, result.error);
            }
        } catch (error) {
            console.error(`[DocumentProcessor] ✗ Error processing ${file.name}:`, error);
            results.push({
                extractedText: '',
                fileType: file.type,
                fileName: file.name,
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    const successCount = results.filter(r => r.success).length;
    console.log(`[DocumentProcessor] Processing complete: ${successCount}/${files.length} successful`);

    return {
        combinedText: textParts.join('\n'),
        results,
        allSuccessful: results.every((r) => r.success),
    };
}
