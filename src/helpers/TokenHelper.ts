import type { UseMutateFunction } from "@tanstack/react-query";
import type { UserSession } from "../Interface/UserSessionData";
import { jwtDecode } from "jwt-decode";
import type { AxiosError, AxiosResponse } from "axios";

export function RefreshToken(mutate: UseMutateFunction<AxiosResponse<unknown, unknown>, AxiosError<unknown, unknown>, {
        Token: string;
    }, unknown>) {
        
    const session = JSON.parse(localStorage.getItem("userSession") ?? "") as UserSession;
    const token = jwtDecode(session.token);

    if(token.exp && token.exp * 1000 < new Date().getTime()) {
        mutate({Token: session.refreshToken});
    }
}
