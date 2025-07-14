import { useAuth } from "../hooks/UseLogin";

function Navbar() {
    const context = useAuth()

    return (
    <nav>
        <span>Bem vindo, {context?.user?.username}!</span>

        <button className="btn btn-danger" onClick={() => context?.logout()}>Sair</button>
    </nav>
    );
}

export default Navbar;