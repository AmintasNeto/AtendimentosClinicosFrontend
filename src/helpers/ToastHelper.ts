import { toast } from "react-toastify";

export function throwInputError(message: string) {
    toast.clearWaitingQueue();
    toast.dismiss();

    return toast.error(message);
}