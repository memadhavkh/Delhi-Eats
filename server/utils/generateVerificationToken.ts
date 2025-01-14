export const generateVerificationToken = (length = 6): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let verificationCode = ''; // 6 digit ka code
    for(let i = 0; i < length; i++) {
        verificationCode += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return verificationCode;
}