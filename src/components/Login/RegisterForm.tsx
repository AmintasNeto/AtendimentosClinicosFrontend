import { useState } from "react";
import { useNavigate } from "react-router";
import { useRegisterMutate } from "../../hooks/UseLogin";
import type { RegisterFormData } from "../../Interface/RegisterFormData";
import { ClipLoader } from "react-spinners";
import { showErrorToast } from "../../helpers/ToastHelper";
import { Form, Button} from 'react-bootstrap';

function RegisterForm() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);

    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState(false);

    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);

    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);

    const [role, setRole] = useState('Patient');

    const { mutate, isPending } = useRegisterMutate();
    const navigate = useNavigate();

    function voltarButtonClicked() {
        navigate("/login");
    }

    function submitButtonClicked(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();

        if (username === '' || username.length < 5) {
            setUsernameError(true);
            
            return showErrorToast("O campo de nome deve ser preenchido com pelo menos 1 nome.");
        }

        if (email === '' 
            || email.length < 3 
            || !email.match(
                new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
            )) {
            setEmailError(true);
            
            return showErrorToast("Email inválido.");
        }

        if (password === '' || password.length < 6) {
            setPasswordError(true);

            return showErrorToast("A senha deve conter mais de 5 caracteres.");
        }

        if (confirmPassword !== password) {
            setConfirmPasswordError(true);

            return showErrorToast("A senha não coincide com a senha confirmação.");
        }

        const registerForm: RegisterFormData = {
            Fullname: username,
            Email: email,
            Password: password,
            ConfirmPassword: confirmPassword,
            Role: role
        };
        mutate(registerForm);
    }

    return (
    <div className="col-xs-12 col-md-6" 
    style={{ backgroundColor: "#f5f5f5", 
        minWidth: "350px", 
        padding: "28px", 
        borderRadius: 8,
        position: "relative",
        transform: "translateY(10%)", 
        justifySelf: "center" }}>
        <Form   >
            <h2 className="text-center mb-4">Registrar conta</h2>

            <Form.Group className="mb-2">
                <Form.Label>Nome</Form.Label>
                <Form.Control disabled={isPending} isInvalid={usernameError} type="text" value={username} onChange={(e) => {
                        setUsername(e.target.value.trim()); 
                        setUsernameError(false);
                    }}/>
            </Form.Group>
            
            <Form.Group className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control disabled={isPending} isInvalid={emailError} type="text" value={email} onChange={(e) => {
                        setEmail(e.target.value.trim());
                        setEmailError(false);
                    }}/>
            </Form.Group>
            
            <Form.Group className="mb-2">
                <Form.Label>Senha</Form.Label>
                <Form.Control disabled={isPending} isInvalid={passwordError} type="password" value={password} onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError(false);
                    }}/>
            </Form.Group>
            
            <Form.Group className="mb-2">
                <Form.Label>Confirme a senha</Form.Label>
                <Form.Control disabled={isPending} isInvalid={confirmPasswordError} type="password" value={confirmPassword} onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setConfirmPasswordError(false);
                    }}/>
            </Form.Group>
            
            <Form.Group className="mb-4">
                <Form.Label>Tipo de Usuário</Form.Label>
                <Form.Select disabled={isPending} value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="Patient">Paciente</option>
                    <option value="Doctor">Médico</option>
                </Form.Select>
            </Form.Group>

            <Form.Group className="d-flex justify-content-between">
                <Button variant="secondary" style={{marginRight: 15}} onClick={voltarButtonClicked}>Voltar</Button>
                {isPending 
                    ? <ClipLoader /> 
                    : <Button type="submit" variant="success" onClick={(e) => submitButtonClicked(e)}>Registrar</Button>
                }
            </Form.Group>
        </Form>
    </ div>
    );
}

export default RegisterForm;