import { Button, Nav } from "react-bootstrap";
import { useAuth } from "../hooks/UseLogin";

function Navbar() {
    const context = useAuth()

    return (
    <Nav className="d-flex" style={{justifyContent: "space-between", backgroundColor: "#f5f5f5", padding: 15}}>
        <span style={{alignSelf: "center", fontWeight: "bold"}}>Bem vindo, {context?.user?.username}!</span>

        <Button className="btn btn-danger" onClick={() => context?.logout()}>Sair</Button>
    </Nav>
    );
}

export default Navbar;