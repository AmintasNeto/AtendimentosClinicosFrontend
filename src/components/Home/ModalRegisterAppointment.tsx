import { DateCalendar, TimePicker } from "@mui/x-date-pickers";
import { useEffect, useState, type MouseEvent } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import type { RegisterAppointmentData } from "../../Interface/RegisterAppointmentData";
import { useAppointmentRegisterMutate, useAppointmentUpdateMutate, type Appointment } from "../../hooks/UseAppointment";
import { ClipLoader } from "react-spinners";
import { useAuth, useRefreshTokenMutate } from "../../hooks/UseLogin";
import { RefreshToken } from "../../helpers/TokenHelper";

type ModalProps = {
    isVisible: boolean; 
    handleCloseModal: () => void;
    appointment?: Appointment;
}

function ModalRegisterAppointment(props: ModalProps) {
    const [todayDate , setTodayDate] = useState(new Date());
    const context = useAuth();

    const [dateAppointment, setDateAppointment] = useState(todayDate);
    const [startTime, setStartTime] = useState(todayDate);
    const [endTime, setEndTime] = useState(todayDate);
    const registerAppointment = useAppointmentRegisterMutate();
    const updateAppointment = useAppointmentUpdateMutate();
    const refreshMutation = useRefreshTokenMutate();

    useEffect(() => {
        if(props.appointment !== undefined) {
            const currentDate = new Date(props.appointment!.appointmentDate + "T" + props.appointment!.appointmentStartTime);
            const dateProp = new Date(props.appointment!.appointmentDate);
            const startTimeProp = new Date(props.appointment!.appointmentDate + "T" + props.appointment!.appointmentStartTime);
            const endTimeProp = new Date(props.appointment!.appointmentDate + "T" + props.appointment!.appointmentEndTime);

            dateProp.setMinutes(dateProp.getMinutes() + dateProp.getTimezoneOffset());

            setTodayDate(currentDate);
            setDateAppointment(dateProp);
            setStartTime(startTimeProp);
            setEndTime(endTimeProp);
        }
    },[props.appointment]);

    function resetValues() {
        setTodayDate(new Date());
        setDateAppointment(new Date());
        setStartTime(new Date());
        setEndTime(new Date());
    }

    function handleSubmit(e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) {
        e.preventDefault();

        const form: RegisterAppointmentData = {
            Id: props.appointment?.id ?? 0,
            AppointmentDate: dateAppointment.toLocaleDateString().split("/").reverse().join("-"),
            AppointmentStartTime: startTime.toLocaleTimeString("pt-BR", {hour: "numeric", minute: "numeric"}) + ":00",
            AppointmentEndTime: endTime.toLocaleTimeString("pt-BR", {hour: "numeric", minute: "numeric"}) + ":00",
            DoctorId: context!.user!.userId,
            PatientId: props.appointment?.patientId
        }
        
        RefreshToken(refreshMutation.mutate);
        if(props.appointment === undefined) {
            registerAppointment.mutate(form, {onSuccess(response) {
                const data = response.data as {flag: boolean, message: string};
                if (data.flag) {
                    resetValues();

                    props.handleCloseModal();
                }
            }});
        } else {
            updateAppointment.mutate(form, {onSuccess(response) {
                const data = response.data as {flag: boolean, message: string};
                if (data.flag) {
                    resetValues();
                    
                    props.handleCloseModal();
                }
            }});
        }
    }

    return (
    <>
        <Modal show={props.isVisible} onHide={props.handleCloseModal} onExit={resetValues}>
            <Modal.Header closeButton>
                <Modal.Title>{props.appointment !== undefined ? "Editar" : "Registrar"} Consulta</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form.Label style={{fontWeight: "bold"}}>Data da Consulta</Form.Label>
                <DateCalendar minDate={todayDate}
                    onChange={(e) => setDateAppointment(e ?? new Date())} 
                    value={dateAppointment}
                    disabled={registerAppointment.isPending || updateAppointment.isPending}
                    sx={{maxHeight: 290, marginTop: -2}}
                    />

                <Form.Label style={{fontWeight: "bold", marginTop: 15}}>Horário de Inicio:</Form.Label>
                <TimePicker minTime={todayDate.toLocaleDateString() === dateAppointment.toLocaleDateString()
                        ? todayDate 
                        : undefined
                    } 
                    onChange={(e) => setStartTime(e ?? new Date())}
                    value={startTime}
                    sx={{margin: 1}}
                    disabled={registerAppointment.isPending || updateAppointment.isPending}
                    slotProps={{textField: {size: "small"}}} />

                <Form.Label style={{fontWeight: "bold", marginTop: 15}}>Horário de Encerramento:</Form.Label>
                <TimePicker minTime={startTime} 
                    onChange={(e) => setEndTime(e ?? new Date())}
                    value={endTime} 
                    sx={{margin: 1}}
                    disabled={registerAppointment.isPending || updateAppointment.isPending}
                    slotProps={{textField: {size: "small"}}}/>
            </Modal.Body>

            <Modal.Footer>
                {registerAppointment.isPending || updateAppointment.isPending ? <ClipLoader />
                : <>
                    <Button variant="secondary" onClick={props.handleCloseModal}>Fechar</Button>
                    <Button variant="success" onClick={(e) => handleSubmit(e)}>Salvar</Button>
                </>}
            </Modal.Footer>
        </Modal>
    </>
    );
}

export default ModalRegisterAppointment;