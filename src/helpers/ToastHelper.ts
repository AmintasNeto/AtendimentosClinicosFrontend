import { toast } from "react-toastify";

export function showErrorToast(message: string) {
    toast.clearWaitingQueue();
    toast.dismiss();

    return toast.error(message);
}

export function showSuccessToast(message: string) {
    toast.clearWaitingQueue();
    toast.dismiss();

    return toast.success(message);
}