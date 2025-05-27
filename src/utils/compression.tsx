import pako from 'pako';

export const compress = (data: unknown): string => {
  const stringData = JSON.stringify(data);
  const compressed = pako.deflate(stringData);
  const binaryString = String.fromCharCode.apply(null, Array.from(compressed));
  return btoa(binaryString);
};

export const decompress = (data: string): unknown => {
  const decoded = atob(data);
  const uint8Array = new Uint8Array(decoded.split('').map(c => c.charCodeAt(0)));
  const decompressed = pako.inflate(uint8Array, { to: 'string' });
  return JSON.parse(decompressed);
};