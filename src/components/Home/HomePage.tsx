import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/UseLogin";
import Navbar from "../Navbar";
import { Button } from "react-bootstrap";
import ModalScheduleAppointment from "./ModalScheduleAppointment";
import ModalRegisterAppointment from "./ModalRegisterAppointment";
import { FaPlus } from "react-icons/fa";
import AppointmentsList from "./AppointmentsList";
import type { Appointment } from "../../hooks/UseAppointment";
import { MenuItem, Select } from "@mui/material";

function HomePage() {
    const context = useAuth();
    const [isVisible, setIsVisible] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [appointment, setAppointment] = useState<Appointment | undefined>();
    const [filterSelected, setFilterSelected] = useState("Todos");

    function handleShowModal(appointment?: Appointment) {
        setAppointment(appointment);
        setIsVisible(true);
    }

    function handleCloseModal() {
        setAppointment(undefined);
        setIsVisible(false);
    }

    useEffect(() => {
        const handleResize = () => {
        setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
        window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
    <>
        <Navbar width={windowWidth} />
        <div style={{
                display: "flex", 
                justifyContent: "space-between", 
                marginRight: 10, 
                marginTop: 30
            }}>
            <Select
                value={filterSelected}
                onChange={(e) => setFilterSelected(e.target.value)}
                style={{
                    marginLeft: 15,
                    maxHeight: 42
                }}
            >
                <MenuItem key={1} value={"Todos"}>Todos</MenuItem>
                <MenuItem key={2} value={"Em Aberto"} hidden={context?.user?.role === "Patient"}>Em Aberto</MenuItem>
                <MenuItem key={3} value={"Agendada"}>Agendada</MenuItem>
                <MenuItem key={4} value={"Finalizada"}>Finalizada</MenuItem>
                <MenuItem key={5} value={"Expirada"} hidden={context?.user?.role === "Patient"}>Expirada</MenuItem>
                <MenuItem key={6} value={"Cancelada"}>Cancelada</MenuItem>
            </Select>
            <Button variant="primary" onClick={() => handleShowModal()} className="button-shadow"
                title={`${context?.user?.role === "Patient" ? "Agendar" : "Cadastrar"} Atendimento`}
                style={{
                    maxHeight: windowWidth >= 768 ? 42 : 38
                }}>
                {windowWidth >= 768 
                    ? <span style={{marginRight: 5}}>{context?.user?.role === "Patient" ? "Agendar" : "Cadastrar"} Atendimento</span>
                    : <></>}
                <FaPlus />
            </Button>
        </div>
        {context?.user?.role === "Patient" 
            ? <ModalScheduleAppointment isVisible={isVisible} handleCloseModal={handleCloseModal} /> 
            : <ModalRegisterAppointment isVisible={isVisible} handleCloseModal={handleCloseModal} appointment={appointment}/>}
        <AppointmentsList windowWidth={windowWidth} handleShowModal={handleShowModal} appointmentStatusFilter={filterSelected}/>
    </>
    );
}

export default HomePage;