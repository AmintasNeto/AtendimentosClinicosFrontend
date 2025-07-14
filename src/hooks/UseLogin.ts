import { createContext, useContext } from "react";
import type { UserSession } from "../Interface/UserSessionData";
import { ApiUrlDev } from "../helpers/Constants";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError, type AxiosPromise } from "axios"
import { useNavigate } from "react-router";
import type { RegisterFormData } from "../Interface/RegisterFormData";
import { toast } from "react-toastify";
import type { LoginFormData } from "../Interface/LoginFormData";

type UserAuth = {
    user: UserSession | null;
    login: (userData: UserSession) => void;
    logout: () => void;
}

const AuthContext = createContext<UserAuth | null>(null);

export const UseAuthContext = () => AuthContext;
export const useAuth = () => useContext(AuthContext);

const postRegister = async (data: RegisterFormData): AxiosPromise<unknown> => {
    const response = await axios.post(ApiUrlDev + '/api/Authentication' + '/register', data);
    return response;
}

export function useRegisterMutate(){
    const navigate = useNavigate();

    const mutate = useMutation({
        mutationFn: postRegister,
        retry: 2,
        onSuccess: () => {
            toast.success("Conta criada com sucesso!");
            navigate("/login");
        },
        onError: (e: AxiosError) => {
            toast.error("Ocorreu um erro ao tentar realizar o cadastro! Código: " + e.response?.status);
        }
    })

    return mutate;
}

const postLogin = async (data: LoginFormData): AxiosPromise<unknown> => {
    const response = await axios.post(ApiUrlDev + '/api/Authentication' + '/login', data);
    return response;
}

export function useLoginMutate(){
    const navigate = useNavigate();
    const context = useAuth();

    const mutate = useMutation({
        mutationFn: postLogin,
        retry: 2,
        onSuccess: (response) => {
            const data = response.data as UserSession;
            context?.login(data);
            navigate("/");
        },
        onError: (e: AxiosError) => {
            toast.error("Ocorreu um erro ao tentar realizar o Login! Código: " + e.response?.status);
        }
    })

    return mutate;
}