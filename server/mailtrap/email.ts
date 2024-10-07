import { client, sender } from "./mailtrap.ts";
import {generatePasswordResetEmailHtml, generateResetSuccessEmailHtml, generateWelcomeEmailHtml, htmlContent} from './htmlEmail'
export const sendVerificationEmail = async(email: string, verificationToken: string) => {
    const recipients = [
        {
            email
        }
    ];

    try {
        await client.testing.send({
            from: sender,
            to: recipients,
            subject: "Verify your Email For Delhi Eats",
            html: htmlContent.replace("{verificationToken}", verificationToken),
            category: "Email Verification"
        }).then(console.log, console.error);
    } catch (error) {
        throw new Error("Failed to send verification email");
    }
}

export const sendWelcomeEmail = async(email: string, name: string) => {
    const recipients = [
        {
            email
        }
    ];
    const htmlContent = generateWelcomeEmailHtml(name);
    try {
        const res = await client.testing.send({
            from: sender,
            to: recipients,
            subject: `Welcome to Delhi Eats, ${name}`,
            html: htmlContent,
            template_variables: {
                company_info_name: "Delhi Eats",
                name: name
            }
        }).then(console.log, console.error);
    } catch (error) {
        throw new Error("Failed to send welcome email");
    }
};

export const sendPasswordResetEmail = async(email: string, resetURL: string) => {
    const recipients = [
        {
            email
        }
    ];
    const htmlContent = generatePasswordResetEmailHtml(resetURL);
    try {
        const res = await client.testing.send({
            from: sender,
            to: recipients,
            subject: `Reset Your Password`,
            html: htmlContent,
            category: "Reset Password"
        }).then(console.log, console.error);
    } catch (error) {
        throw new Error("Failed to send reset password email");
    }
};

export const sendResetSuccessEmail = async(email: string) => {
    const recipients = [
        {
            email
        }
    ];
    const htmlContent = generateResetSuccessEmailHtml();
    try {
        const res = await client.testing.send({
            from: sender,
            to: recipients,
            subject: `Password Reset Successful`,
            html: htmlContent,
            category: "Reset Password"
        }).then(console.log, console.error);
    } catch (error) {
        throw new Error("Failed to send reset success email");
    }
}