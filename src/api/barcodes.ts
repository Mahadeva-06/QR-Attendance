import axios from 'axios';

// Use dynamic API URL - works in both dev and production
const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:3000/api`;

console.log('Barcode API URL:', API_BASE_URL);

/**
 * Generate QR Code for a student
 */
export const generateQRCode = async (studentId: string, studentName: string) => {
  try {
    console.log('Calling generateQRCode with:', { studentId, studentName });
    const response = await axios.post(`${API_BASE_URL}/barcodes/qr-code`, {
      studentId,
      studentName,
    }, {
      timeout: 30000,
    });
    console.log('QR Code response:', response.data);
    return response.data;
  } catch (error) {
    console.error('QR Code generation error:', error);
    throw error;
  }
};

/**
 * Generate Barcode (CODE128) for a student
 */
export const generateBarcode = async (studentId: string, studentName: string) => {
  try {
    console.log('Calling generateBarcode with:', { studentId, studentName });
    const response = await axios.post(`${API_BASE_URL}/barcodes/barcode`, {
      studentId,
      studentName,
    }, {
      timeout: 30000,
    });
    console.log('Barcode response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Barcode generation error:', error);
    throw error;
  }
};

/**
 * Generate both QR Code and Barcode for printing
 */
export const generateBothFormats = async (
  studentId: string,
  studentName: string,
  batchId?: string,
  batchName?: string
) => {
  try {
    console.log('Calling generateBothFormats with:', { studentId, studentName, batchId, batchName });
    const response = await axios.post(`${API_BASE_URL}/barcodes/both`, {
      studentId,
      studentName,
      batchId,
      batchName,
    }, {
      timeout: 30000,
    });
    console.log('Both formats response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Both formats generation error:', error);
    throw error;
  }
};
