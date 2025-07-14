import { useState } from "react";
import { useLoginMutate } from "../hooks/UseLogin";
import type { LoginFormData } from "../Interface/LoginFormData";
import { ClipLoader } from "react-spinners";
import { throwInputError } from "../helpers/ToastHelper";
import { Button, Form, NavLink } from "react-bootstrap";

function LoginForm() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);

    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);

    const { mutate, isPending } = useLoginMutate();

    function submitButtonClicked(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();

        if (email === '' 
            || email.length < 3 
            || !email.match(
                new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
            )) {
            setEmailError(true);
            
            return throwInputError("Email ou senha inválido.");
        }

        if (password === '' || password.length < 6) {
            setPasswordError(true);

            return throwInputError("Email ou senha inválido.");
        }

        const registerForm: LoginFormData = {
            Email: email,
            Password: password
        };
        mutate(registerForm);
    }

    return (
    <div className="col-xs-12 col-md-6" style={{ backgroundColor: "#f5f5f5", minHeight: "400px", padding: "28px", borderRadius: 8, justifySelf: "center" }}>
        <Form>
            <h2 className="text-center mb-4">Login</h2>

            {isPending ? <ClipLoader />
            : <>
                <Form.Group className="mb-2">
                    <Form.Label>Email</Form.Label>
                    <Form.Control isInvalid={emailError} type="text" value={email} onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError(false);
                        }}/>
                </Form.Group>

                <Form.Group className="mb-2">
                    <Form.Label>Senha</Form.Label>
                    <Form.Control isInvalid={passwordError} type="password" value={password} onChange={(e) => {
                            setPassword(e.target.value);
                            setPasswordError(false);
                        }}/>
                </Form.Group>

                <Form.Group className="row g-3 mt-5">
                    <span>Não possui conta? 
                        <NavLink style={{textDecoration: "underline"}} href="/registrar">Registre-se</NavLink>
                    </span>
                    <Button type="submit" variant="success" onClick={(e) => submitButtonClicked(e)}>Login</Button>
                </Form.Group>
            </>}
        </Form>
    </ div>
    );
}

export default LoginForm;