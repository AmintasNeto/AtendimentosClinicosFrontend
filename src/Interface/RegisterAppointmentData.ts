export interface RegisterAppointmentData {
    Id: number;
    AppointmentDate: string;
    AppointmentStartTime: string;
    AppointmentEndTime: string;
    DoctorId: number;
    PatientId?: number;
}