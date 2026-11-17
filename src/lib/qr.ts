import QRCode from "qrcode";

export const qrSvg = (text: string): Promise<string> =>
  QRCode.toString(text, { type: "svg", margin: 1, errorCorrectionLevel: "M" });

export const qrPng = (text: string): Promise<Buffer> =>
  QRCode.toBuffer(text, { type: "png", width: 1024, margin: 2, errorCorrectionLevel: "M" });
