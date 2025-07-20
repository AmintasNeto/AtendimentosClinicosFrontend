import { Button, Modal } from "react-bootstrap";
import { useAppointmentOpennedData, useAppointmentScheduleMutate, type Appointment } from "../../hooks/UseAppointment";
import { useEffect, useState, type MouseEvent } from "react";
import { Autocomplete, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import type { RegisterAppointmentData } from "../../Interface/RegisterAppointmentData";
import { useAuth } from "../../hooks/UseLogin";
import { ClipLoader } from "react-spinners";
import { throwInputError } from "../../helpers/ToastHelper";

type ModalProps = {
    isVisible: boolean; 
    handleCloseModal: () => void;
}

function ModalScheduleAppointment(props: ModalProps) {
    const opennedAppointments = useAppointmentOpennedData();
    const scheduleAppointment = useAppointmentScheduleMutate();
    const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
    const [selectedAppointment, setSelectedAppointment] = useState(0);
    const [appointmentsMap, setAppointmentsData] = useState<Map<number, Appointment>>(new Map());
    const [doctorsNameList, setDoctorsNameList] = useState<string[]>([]);
    const [doctorsMap, setDoctorsMap] = useState<Map<string, number>>(new Map());
    const context = useAuth();

    useEffect(() => {
        if(opennedAppointments.isSuccess){
            const doctorsName: string[] = doctorsNameList;
            const doctors: Map<string, number> = doctorsMap;
            const appointmentsMapTemp: Map<number, Appointment> = new Map();

            opennedAppointments.data?.forEach(appointment => {
                appointmentsMapTemp.set(appointment.id, appointment);
                const doctor = {id: appointment.doctorId, name: appointment.doctor.fullname};

                if(!doctorsName.some(d => d === doctor.name)) {
                    doctorsName.push(doctor.name);
                    doctors.set(doctor.name, doctor.id);
                }
            });

            setAppointmentsData(appointmentsMapTemp);
            setDoctorsNameList(doctorsName);
            setDoctorsMap(doctors);
        }
    }, [doctorsMap, doctorsNameList, opennedAppointments.data, opennedAppointments.isSuccess]);

    function resetValues() {
        setSelectedDoctor(null);
        setSelectedAppointment(0);
        setAppointmentsData(new Map());
        setDoctorsNameList([]);
        setDoctorsMap(new Map());
    }

    function handleSubmit(e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) {
        e.preventDefault();

        if(selectedDoctor !== null && selectedAppointment !== 0) {
            const appointmentForm = appointmentsMap?.get(selectedAppointment);
            const appointmentToSchedule: RegisterAppointmentData = {
                Id: appointmentForm!.id,
                AppointmentDate: appointmentForm!.appointmentDate,
                AppointmentStartTime: appointmentForm!.appointmentStartTime,
                AppointmentEndTime: appointmentForm!.appointmentEndTime,
                DoctorId: appointmentForm!.doctorId,
                PatientId: context?.user?.userId
            };

            scheduleAppointment.mutate(appointmentToSchedule, {onSuccess(response) {
                    const data = response.data as {flag: boolean, message: string};
                    if (data.flag) {
                        resetValues();

                        props.handleCloseModal();
                    }
                }});
        } else {
            throwInputError("Um médico e uma consulta devem ser selecionados para poder agendar uma consultas!")
        }
    }

    return (
    <>
        <Modal show={props.isVisible} onHide={props.handleCloseModal} onExit={resetValues}>
            <Modal.Header closeButton>
            <Modal.Title>Agendar Consulta</Modal.Title>
            </Modal.Header>

            <Modal.Body aria-hidden={false}>
                <InputLabel id="appointment-autocomplet-label">Médico</InputLabel>
                <Autocomplete
                    value={selectedDoctor}
                    options={doctorsNameList}
                    disabled={scheduleAppointment.isPending}
                    onChange={(_, newValue) => setSelectedDoctor(newValue)}
                    style={{
                        marginTop: 5,
                        marginBottom: 25
                    }}
                    renderInput={(params) => <TextField {...params} label="Selecione um médico..." />}
                />
                <InputLabel hidden={selectedDoctor === null} id="appointment-select-label">Consulta</InputLabel>
                <Select
                    labelId="appointment-select-label"
                    value={selectedAppointment}
                    onChange={(e) => setSelectedAppointment(e.target.value)}
                    label="Consulta"
                    disabled={scheduleAppointment.isPending}
                    hidden={selectedDoctor === null}
                >
                    <MenuItem key={0} value={0} disabled={true}>Selecione uma consulta...</MenuItem>
                    {Array.from(appointmentsMap.values()).map((appointment, index) => 
                        {
                            if(selectedDoctor !== null && appointment.doctor.fullname === selectedDoctor) {
                                return <MenuItem key={index + 1} value={appointment.id} style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "start"
                                }}>
                                            <div>
                                                <span style={{fontWeight: "bold"}}>Dia: </span>{appointment.appointmentDate}    
                                            </div>
                                            <div>
                                                <span style={{fontWeight: "bold"}}>Horário: </span>{appointment.appointmentStartTime} - {appointment.appointmentEndTime}    
                                            </div> 
                                        </MenuItem>;
                            }
                        }
                    )}
                </Select>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleCloseModal}>Fechar</Button>
                {scheduleAppointment.isPending 
                    ? <ClipLoader />
                    : <Button variant="success" onClick={(e) => handleSubmit(e)}>Agendar</Button>}
            </Modal.Footer>
        </Modal>
    </>
    );
}

export default ModalScheduleAppointment;