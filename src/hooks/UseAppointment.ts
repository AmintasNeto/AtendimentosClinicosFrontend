import { useMutation, useQuery, useQueryClient, type QueryFunctionContext } from "@tanstack/react-query";
import axios, { AxiosError, type AxiosPromise } from "axios";
import { ApiUrlDev } from "../helpers/Constants";
import type { RegisterAppointmentData } from "../Interface/RegisterAppointmentData";
import { showErrorToast, showSuccessToast } from "../helpers/ToastHelper";

export interface Appointment {
    id: number;
    appointmentDate: string;
    appointmentStartTime: string;
    appointmentEndTime: string;
    isCanceled: boolean;
    doctorId: number;
    doctor: {id: number, fullname: string};
    patientId: number;
    patient: {id: number, fullname: string};
}

const postAppontmentRegister = async (data: RegisterAppointmentData): AxiosPromise<unknown> => {
    const response = await axios.post(ApiUrlDev + '/api/Appointments' + '/add', data);
    return response;
}

export function useAppointmentRegisterMutate(){
    const queryClient = useQueryClient();
    
    const localMutate = useMutation({
        mutationFn: postAppontmentRegister,
        retry: 2,
        onSuccess: (response) => {
            const data = response.data as {flag: boolean, message: string};
            if (data.flag) {
                queryClient.invalidateQueries({queryKey: ['appointment-data']});
                showSuccessToast("Consulta criada com sucesso!");
            }
            else showErrorToast(data.message);
        },
        onError: (e: AxiosError) => {
            showErrorToast("Ocorreu um erro ao tentar realizar o cadastro da consulta! Código: " + e.response?.status);
        }
    })

    return localMutate;
}

const putAppontmentUpdate = async (data: RegisterAppointmentData): AxiosPromise<unknown> => {
    const response = await axios.put(ApiUrlDev + '/api/Appointments' + '/update', data);
    return response;
}

export function useAppointmentUpdateMutate(){
    const queryClient = useQueryClient();
    
    const localMutate = useMutation({
        mutationFn: putAppontmentUpdate,
        retry: 2,
        onSuccess: (response) => {
            const data = response.data as {flag: boolean, message: string};
            if (data.flag) {
                queryClient.invalidateQueries({queryKey: ['appointment-data']});
                showSuccessToast("Consulta atualizada com sucesso!");
            }
            else showErrorToast(data.message);
        },
        onError: (e: AxiosError) => {
            showErrorToast("Ocorreu um erro ao tentar realizar o cadastro da consulta! Código: " + e.response?.status);
        }
    })

    return localMutate;
}

const fetchAppointmentData = async ({ queryKey }: QueryFunctionContext): AxiosPromise<Appointment[]> => {
    const token = queryKey[1];
    const response = axios.get(ApiUrlDev + '/api/Appointments' + '/all', {params: {token}});
    return response;
}

export function useAppointmentData(token: string){
    const query = useQuery({
        queryFn: fetchAppointmentData,
        queryKey: ['appointment-data', token],
        retry: 2
    })

    return {
        ...query,
        data: query.data?.data
    }
}

const fetchAppointmentOpennedData = async (): AxiosPromise<Appointment[]> => {
    const response = axios.get(ApiUrlDev + '/api/Appointments' + '/all-openned');
    return response;
}

export function useAppointmentOpennedData(){
    const query = useQuery({
        queryFn: fetchAppointmentOpennedData,
        queryKey: ['appointment-data'],
        retry: 2
    })

    return {
        ...query,
        data: query.data?.data
    }
}

const deleteAppointmentData = async (id: number): AxiosPromise<unknown> => {
    const response = axios.delete(ApiUrlDev + '/api/Appointments' + '/delete', {params: {id}});
    return response;
}

export function useAppointmentDeleteMutate(){
    const queryClient = useQueryClient();
    
    const localMutate = useMutation({
        mutationFn: deleteAppointmentData,
        retry: 2,
        onSuccess: (response) => {
            const data = response.data as {flag: boolean, message: string};
            if (data.flag) {
                queryClient.invalidateQueries({queryKey: ['appointment-data']});
                showSuccessToast("Consulta cancelada com sucesso!");
            }
            else showErrorToast(data.message);
        },
        onError: (e: AxiosError) => {
            showErrorToast("Ocorreu um erro ao tentar realizar o cancelamento da consulta! Código: " + e.response?.status);
        }
    })

    return localMutate;
}

const putAppontmentSchedule = async (data: RegisterAppointmentData): AxiosPromise<unknown> => {
    const response = await axios.put(ApiUrlDev + '/api/Appointments' + '/schedule', data);
    return response;
}

export function useAppointmentScheduleMutate(){
    const queryClient = useQueryClient();
    
    const localMutate = useMutation({
        mutationFn: putAppontmentSchedule,
        retry: 2,
        onSuccess: (response) => {
            const data = response.data as {flag: boolean, message: string};
            if (data.flag) {
                queryClient.invalidateQueries({queryKey: ['appointment-data']});
                showSuccessToast("Consulta agendada com sucesso!");
            }
            else showErrorToast(data.message);
        },
        onError: (e: AxiosError) => {
            showErrorToast("Ocorreu um erro ao tentar realizar o agendamento da consulta! Código: " + e.response?.status);
        }
    })

    return localMutate;
}

const putAppointmentCancelSchedule = async (id: number): AxiosPromise<unknown> => {
    const response = await axios.delete(ApiUrlDev + '/api/Appointments' + '/cancel-schedule', {params: {id}});
    return response;
}

export function useAppointmentCancelScheduleMutate(){
    const queryClient = useQueryClient();
    
    const localMutate = useMutation({
        mutationFn: putAppointmentCancelSchedule,
        retry: 2,
        onSuccess: (response) => {
            const data = response.data as {flag: boolean, message: string};
            if (data.flag) {
                queryClient.invalidateQueries({queryKey: ['appointment-data']});
                showSuccessToast("Consulta cancelada com sucesso!");
            }
            else showErrorToast(data.message);
        },
        onError: (e: AxiosError) => {
            showErrorToast("Ocorreu um erro ao tentar realizar o cancelamento da consulta! Código: " + e.response?.status);
        }
    })

    return localMutate;
}