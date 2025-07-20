import { ClipLoader } from "react-spinners";
import { useAppointmentData, type Appointment } from "../../hooks/UseAppointment";
import { useAuth } from "../../hooks/UseLogin";
import AppointmentsCard from "./AppointmentCard";
import { List } from "@mui/material";

type AppointmentsListProps = {
    windowWidth: number;
    handleShowModal: (appointment?: Appointment) => void;
    appointmentStatusFilter: string;
}

function checkAppointmentStatus(appointment: Appointment) {
        const appointmentDate = new Date(appointment.appointmentDate + "T" + appointment.appointmentEndTime);

        if(appointment.isCanceled) {
            return "Cancelada";
        }

        if(appointment.patientId !== null && appointmentDate < new Date()) {
            return "Finalizada";
        }

        if(appointment.patientId !== null && appointmentDate >= new Date()) {
            return "Agendada";
        }

        if(appointmentDate < new Date()) {
            return "Expirada";
        }

        return "Em Aberto";
    }

function AppointmentsList(props: AppointmentsListProps) {
    const context = useAuth();
    const { data, isPending } = useAppointmentData(context?.user?.refreshToken ?? "");

    return (
        <div style={{marginTop: 25}}>
            {isPending ? <ClipLoader />
                : data?.length === 0 
                    ? <span style={{fontSize: props.windowWidth >= 768 ? 20 : 14}}>Você não tem nenhuma consulta agendada.</span>
                    : <List style={{overflow: "auto", maxHeight: props.windowWidth >= 768 ? 490 : 430}}>
                        {
                            data?.map((appointmentData, index) => {
                                const appointmentStatus = checkAppointmentStatus(appointmentData);
                                if(appointmentStatus === props.appointmentStatusFilter
                                    || props.appointmentStatusFilter === "Todos"
                            ){
                                    return <AppointmentsCard key={index} 
                                        appointment={appointmentData} 
                                        appointmentStatus={appointmentStatus}
                                        windowWidth={props.windowWidth} 
                                        handleShowModal={props.handleShowModal}
                                    />
                                }

                                return undefined;
                            })
                                
                        }
                    </List>
            }
        </div>  
    );
}

export default AppointmentsList;