import dotenv from 'dotenv';
import {MailtrapClient} from 'mailtrap'

dotenv.config();
const TOKEN = process.env.API_TOKEN;

export const client = new MailtrapClient({
    token : TOKEN!,
    testInboxId: 3169196
});

export const sender = {
    email: "mailtrap@demomailtrap.com",
    name: "Delhi Eats",
};
