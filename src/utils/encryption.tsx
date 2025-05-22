//Encoding the token to base64
export const encryptToken = (token: string): string => {
  try {
    const encrypted = btoa(token);
    console.log('Token original:', token);
    console.log('Token encriptado:', encrypted);
    return encrypted;
  } catch (error) {
    console.error("Encryption error:", error);
    return token;
  }
};

// Decoding the token from base64
export const decryptToken = (encryptedToken: string): string => {
  try {
    const decrypted = atob(encryptedToken);
    console.log('Token encriptado:', encryptedToken);
    console.log('Token desencriptado:', decrypted);
    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    return encryptedToken;
  }
};
