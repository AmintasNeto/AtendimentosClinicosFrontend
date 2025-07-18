import { Button, Nav } from "react-bootstrap";
import { useAuth } from "../hooks/UseLogin";
import { FaSignOutAlt } from "react-icons/fa";

type NavProps = {
    width: number;
}

function Navbar(props: NavProps) {
    const context = useAuth()

    return (
    <Nav className="d-flex" style={{justifyContent: "space-between", backgroundColor: "#f5f5f5", padding: 15}}>
        <span style={{alignSelf: "center", fontWeight: "bold"}}>Bem vindo, {context?.user?.username}!</span>

        <Button className="btn btn-danger button-shadow" onClick={() => context?.logout()}>{props.width >= 768 ? "Sair" : ""} <FaSignOutAlt /></Button>
    </Nav>
    );
}

export default Navbar;