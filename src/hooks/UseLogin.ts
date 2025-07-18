import { createContext, useContext } from "react";
import type { UserSession } from "../Interface/UserSessionData";
import { ApiUrlDev } from "../helpers/Constants";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError, type AxiosPromise } from "axios"
import { useNavigate } from "react-router";
import type { RegisterFormData } from "../Interface/RegisterFormData";
import { toast } from "react-toastify";
import type { LoginFormData } from "../Interface/LoginFormData";

export type UserAuth = {
    user: UserSession | null;
    login: (userData: UserSession) => void;
    update: (userData: UserSession) => void;
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
            
            if(data.flag) {
                context!.login(data);
                localStorage.setItem("userSession", JSON.stringify(data));
                navigate("/");
            }
        },
        onError: (e: AxiosError) => {
            toast.error("Ocorreu um erro ao tentar realizar o Login! Código: " + e.response?.status);
        }
    })

    return mutate;
}

const postRefreshToken = async (data: {Token: string}): AxiosPromise<unknown> => {
    const response = await axios.post(ApiUrlDev + '/api/Authentication' + '/refresh-token', data);
    return response;
}

export function useRefreshTokenMutate(){
    const context = useAuth();

    const mutate = useMutation({
        mutationFn: postRefreshToken,
        retry: 2,
        onSuccess: (response) => {
            const data = response.data as UserSession;
            if (data.flag) {
                context!.update(data);
                localStorage.setItem("userSession", JSON.stringify(context?.user));
            }
        },
        onError: (e: AxiosError) => {
            toast.error("Ocorreu um erro ao tentar atualizar o token! Código: " + e.response?.status);
        }
    })

    return mutate;
}