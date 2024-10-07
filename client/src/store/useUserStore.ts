import {create} from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware'
import axios from 'axios'
import { LoginInputState, SignUpInputState } from '@/schema/userSchema';
import { toast } from 'sonner';

const API_ENDPOINT = 'http://localhost:8000/api/v1/user';
axios.defaults.withCredentials = true;

type User = {
    name: string,
    email: string,
    contact: number,
    address: string,
    city: string,
    country: string,
    profilePic?: string,
    admin: boolean,
    isVerified?: boolean,
}

type UserState = {
    user: User | null,
    isAuthenticated: boolean,
    isCheckingAuth: boolean,
    loading: boolean,
    register: (input: SignUpInputState) => Promise<void>,
    login: (input: LoginInputState) => Promise<void>,
    verifyEmail: (verificationCode: string) => Promise<void>,
    checkAuthentication: () => Promise<void>,
    logout: () => Promise<void>,
    forgotPassword: (email: string) => Promise<void>,
    resetPassword: (token: string, newPassword: string) => Promise<void>,
    updateProfile: (input: ProfileData) => Promise<void>
}
type ProfileData = {
    name?: string;
    email?: string;
    address?: string;
    city?: string;
    country?: string;
    profilePic?: string;
}

export const useUserStore = create<UserState>()(persist((set) => ({
    loading: false,
    user: null,
    isAuthenticated: false,
    isCheckingAuth: true,
    // signup api implementation
    register: async(input: SignUpInputState) => {
        try {
            set({loading: true});
            const response = await axios.post(`${API_ENDPOINT}/register`, input, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if(response.data.success){
                toast.success(response.data.message);
                set({loading: false, user:response.data.user, isAuthenticated: true});
                toast.success("Check Console for the verification code. Since the app is in testing mode, emails can't be sent in bulk.")
                console.log(response.data.verificationToken)
            }
        } catch{
            set({loading: false});
            toast.error("Error While Registering");
        }
    },
    login: async(input: LoginInputState) => {
        try {
            set({loading: true});
            const response = await axios.post(`${API_ENDPOINT}/login`, input, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if(response.data.success){
                toast.success(response.data.message);
                set({loading: false, user:response.data.user, isAuthenticated: true});
            }
        } catch{
            set({loading: false});
            toast.error("Failed To Login!");
        }
    },
    verifyEmail: async (verificationCode: string) => {
        try {
            set({loading: true});
            const response = await axios.post(`${API_ENDPOINT}/verify-email`, {verificationCode}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if(response.data.success){
                toast.success(response.data.message)
                set({loading: false, user: response.data.user, isAuthenticated: true});
            }
        } catch {
            set({loading: false});
            toast.error("Failed To Verify Email");
            
        }
    },
    checkAuthentication: async () => {
        try {
            set({isCheckingAuth: true, loading: false});
            const response = await axios.get(`${API_ENDPOINT}/check-auth`);
            if(response.data.success){
                set({user: response.data.user, isAuthenticated: true, isCheckingAuth: false})
            }
        } catch {
            set({ isAuthenticated: false, isCheckingAuth: false})
        }
    },
    logout: async () => {
        try {
            set({loading: true});
            const response = await axios.post(`${API_ENDPOINT}/logout`);
            if(response.data.success){
                toast.success(response.data.message)
                set({loading: false, user: null, isAuthenticated: false});
            }
        } catch {
            toast.error("Failed To Logout");
            set({loading: false});
        }
    },
    forgotPassword: async (email: string) => {
        try {
            set({loading: true});
            const response = await axios.post(`${API_ENDPOINT}/forgot-password`, {email});
            if(response.data.success){
                toast.success(response.data.message)
                set({loading: false});
                toast.success("Check Console for the reset password link.")
            }
        } catch {
            toast.error("Failed To Send Reset Password Link");
            set({loading: false});
        }
    },
    resetPassword: async (token: string, newPassword: string) => {
        try {
            set({loading: true});
            const response = await axios.post(`${API_ENDPOINT}/reset-password/${token}`, {newPassword});
            if(response.data.success){
                toast.success(response.data.message)
                set({loading: false});
            } 
        } catch {
            toast.error("Invalid or expired reset password token");
            set({loading: false});
        }
    },
    updateProfile: async (input: ProfileData) => {
        set({loading: true});
        try {
            const response = await axios.put(`${API_ENDPOINT}/profile/update`, input, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if(response.data.success){
                toast.success(response.data.message)
                set({user: response.data.user, isAuthenticated: true, loading: false});
            }
        } catch {
            toast.error("No Previous User With These Credentials.");
            set({loading: false});
        }
    }
}),
{
    name: 'user-name',
    storage: createJSONStorage(() => localStorage),
}
))