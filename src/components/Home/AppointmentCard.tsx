import { Button } from "react-bootstrap";
import { useAppointmentCancelScheduleMutate, useAppointmentDeleteMutate, type Appointment } from "../../hooks/UseAppointment";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { useAuth } from "../../hooks/UseLogin";
import { ClipLoader } from "react-spinners";

type AppointmentCardProps = {
    appointment: Appointment;
    appointmentStatus: string;
    windowWidth: number;
    handleShowModal: (appointment?: Appointment) => void;
}

function AppointmentsCard(props: AppointmentCardProps) {
    const context = useAuth();
    const deleteAppointment = useAppointmentDeleteMutate();
    const cancelAppointmentSchedule = useAppointmentCancelScheduleMutate();

    function handleDeleteClicked(id: number) {
        if(context?.user?.role !== "Patient") {
            deleteAppointment.mutate(id);
        } else {
            cancelAppointmentSchedule.mutate(id);
        }
    }

    function checkAppointmentStatus(appointment: Appointment) {
        const appointmentDate = new Date(appointment.appointmentDate + "T" + appointment.appointmentEndTime);

        if(appointment.isCanceled) {
            return {color: "red", text: "Cancelada"};
        }

        if(appointment.patientId !== null && appointmentDate < new Date()) {
            return {color: "green", text: "Finalizada"};
        }

        if(appointment.patientId !== null && appointmentDate >= new Date()) {
            return {color: "lightgreen", text: "Agendada"};
        }

        if(appointmentDate < new Date()) {
            return {color: "orange", text: "Expirada"};
        }

        return {color: "blue", text: "Em Aberto"};
    }

    function loadStatusBar(appointment: Appointment) {
        const {color, text} = checkAppointmentStatus(appointment);

        return (
            <div style={{
                        padding: 2,
                        backgroundColor: color,
                        color: "white",
                        fontWeight: "bold",
                        borderRadius: 16
                    }}>
                {text}
            </div>
        );
    }

    return (
    <div className="col-xs-12 card-box" style={{
            backgroundColor: "#f5f5f5", 
            margin: 15, 
            padding: 10, 
            fontSize: props.windowWidth >= 768 ? 16 : 14,
            minHeight: props.windowWidth >= 768 ? 100 : 88,
            borderRadius: 8,
            display: "flex",
            justifyContent: deleteAppointment.isPending || cancelAppointmentSchedule.isPending ? "center" : "space-between",
            alignItems: "center"
        }}>
        {deleteAppointment.isPending || cancelAppointmentSchedule.isPending
            ? <ClipLoader />
            : <>
                <div>
                    {loadStatusBar(props.appointment)}
                    <div style={{display: "flex", justifyContent: "start"}}>
                        <span style={{
                            overflow: "hidden", 
                            whiteSpace: "nowrap", 
                            textOverflow: "ellipsis"
                        }}><span style={{fontWeight: "bold"}}>Médico:</span> {props.appointment.doctor.fullname}</span>
                    </div>
                    {props.appointment.patientId !== null 
                    ? <div style={{display: "flex", justifyContent: "start"}}>
                            <span style={{
                                overflow: "hidden", 
                                whiteSpace: "nowrap", 
                                textOverflow: "ellipsis"
                            }}><span style={{fontWeight: "bold"}}>Paciente:</span> {props.appointment.patient.fullname}</span>
                        </div>
                    : <></>
                    }
                    <div style={{display: "flex", justifyContent: "start"}}>
                        <span style={{marginRight: 15}}>
                            <span style={{fontWeight: "bold"}}>Data:</span> {props.appointment.appointmentDate.split("-").reverse().join("/")}
                        </span>
                        <span>
                            <span style={{fontWeight: "bold"}}>Horário: </span> 
                            {props.appointment.appointmentStartTime.split(":").slice(0, 2).join(":")} - {props.appointment.appointmentEndTime.split(":").slice(0, 2).join(":")}
                        </span>
                    </div>
                </div>
                <div style={{display: "flex", alignItems: "center"}}>
                    {context?.user?.role !== "Patient" 
                    ?   <div style={{display: "flex", justifyContent: "start", gap: 10}}>
                            <Button variant="warning" 
                                size={props.windowWidth >= 768 ? "lg" : "sm"} 
                                title="Editar Consulta" 
                                className="button-shadow"
                                onClick={() => props.handleShowModal(props.appointment)}
                            >
                                <FaPencilAlt />
                            </Button>
                            <Button 
                                variant="danger" 
                                size={props.windowWidth >= 768 ? "lg" : "sm"} 
                                title="Cancelar Consulta" 
                                className="button-shadow"
                                onClick={() => handleDeleteClicked(props.appointment.id)}
                            >
                                <FaTrash />
                            </Button>
                        </div>
                    : <Button 
                        hidden={props.appointmentStatus !== "Agendada"}
                        variant="danger" 
                        size={props.windowWidth >= 768 ? "lg" : "sm"} 
                        title="Cancelar Agendamento" 
                        className="button-shadow"
                        onClick={() => handleDeleteClicked(props.appointment.id)}
                    >
                        <FaTrash />
                    </Button>
                    }
                </div>
            </>}
    </div>
    );
}

export default AppointmentsCard;