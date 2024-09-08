import { create } from "zustand";
import axios from '../lib/axios';
import { toast } from 'react-hot-toast';

export const useUserStore = create((set, get) => ({
    user: null,
    loading: false,
    checkingAuth: true,

    signup: async ({ name, email, password, confirmPassword }) => {
        set({ loading: true });
        if (password !== confirmPassword) {
            set({ loading: false });
            return toast.error("Password do not match");
        }

        try {
            const res = await axios.post("/auth/register", { name, email, password });
            set({ user: res.data.user, loading: false });
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message || "An error occured");
        }
    },
    login: async ({ email, password }) => {
        set({ loading: true });

        try {
            const res = await axios.post("/auth/login", { email, password });
            set({ user: res.data.user, loading: false });
        } catch (error) {
            set({ loading: false });
        }
    },
    checkAuth: async () => {
        set({ checkingAuth: true });
        try {
            const response = await axios.get("/auth/profile");
            set({ user: response.data, checkingAuth: false });
        } catch (error) {
            set({ checkingAuth: false, user: null });
        }
    },
    logout: async () => {
        set({ checkingAuth: true });
        try {
            const response = await axios.post('/auth/logout');
            set({ user: null, checkingAuth: false });
        } catch (error) {
            set({ checkingAuth: false });
            toast.error(error.response.data.message || "An error occured");
        }
    }
}));