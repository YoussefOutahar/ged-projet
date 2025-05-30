import axiosInstance from "app/axiosInterceptor";
import { MailRequest } from "app/controller/model/mail/MailRequest";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export class MailService {
    static sendMail(mailRequest : MailRequest) {
        return axiosInstance.post(`${NEXT_PUBLIC_API_URL}/email/sendMail/${false}`,mailRequest);
    }
}