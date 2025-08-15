import QRCode from 'qrcode';

export interface QRCodeOptions {
  usePlaceholder?: boolean;
  size?: number;
  margin?: number;
  color?: {
    dark: string;
    light: string;
  };
}

/**
 * Generate a QR code image or return placeholder
 * @param data - The data to encode in the QR code
 * @param options - QR code generation options
 * @returns Promise<string> - Data URL of the QR code image
 */
export async function generateQRCode(
  data: string, 
  options: QRCodeOptions = {}
): Promise<string> {
  const {
    usePlaceholder = true,
    size = 256,
    margin = 2,
    color = {
      dark: '#000000',
      light: '#FFFFFF'
    }
  } = options;

  // If placeholder is requested, return the mntqr.png path
  if (usePlaceholder) {
    return '/icons/mntqr.png';
  }

  // Generate actual QR code
  try {
    const qrDataURL = await QRCode.toDataURL(data, {
      width: size,
      margin,
      color,
      errorCorrectionLevel: 'M'
    });
    return qrDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    // Fallback to placeholder if generation fails
    return '/icons/mntqr.png';
  }
}

/**
 * Generate QR code for invoice payment
 * @param invoiceId - The invoice ID
 * @param amount - The payment amount
 * @param options - QR code options
 * @returns Promise<string> - Data URL of the QR code image
 */
export async function generateInvoiceQRCode(
  invoiceId: string,
  amount?: string,
  options: QRCodeOptions = {}
): Promise<string> {
  const paymentUrl = `${window.location.origin}/i/${invoiceId}`;
  return generateQRCode(paymentUrl, options);
}

/**
 * Generate QR code for wallet address
 * @param address - The wallet address
 * @param options - QR code options
 * @returns Promise<string> - Data URL of the QR code image
 */
export async function generateWalletQRCode(
  address: string,
  options: QRCodeOptions = {}
): Promise<string> {
  return generateQRCode(address, options);
}
