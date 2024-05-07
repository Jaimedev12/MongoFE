import { useState, useEffect } from "react";
import "./App.css";
import Notification from "./components/Notificactions";
import InputArea from "./InputArea";
import ListArea from "./ListArea";
import loginService from "./services/login";
import productService from "./services/productos";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Row, Col } from "react-bootstrap";

function App() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const [user, setUser] = useState(null);
    const [productos, setProductos] = useState(["unchanged"]);
    const currentRol = window.localStorage.getItem("rol");

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem("loggedAppUser");
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            setUser(user);
        }

        const fetchData = async () => {
            const data = await productService.getAllProducts();
            const productsArray = data.map((product) => {
                return {
                    id: product.id,
                    producto: product.content.producto,
                    precio: product.content.precio,
                };
            });
            setProductos(productsArray);
        };

        fetchData();
    }, []);

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const user = await loginService.login({
                username,
                password,
            });

            window.localStorage.setItem("loggedAppUser", JSON.stringify(user));
            window.localStorage.setItem("token", user.token);
            window.localStorage.setItem("rol", user.rol);

            setUser(user);
            setUsername("");
            setPassword("");
        } catch (exception) {
			alert("Usuario o contraseña incorrectos")
            setUsername("");
            setPassword("");
            setTimeout(() => {
                setErrorMessage(null);
            }, 3000);
        }
    };

    const productsForm = () => (
        <div className="container mt-5">
            <ListArea productos={productos} />

            {currentRol == "root" ? (
                <InputArea productos={productos} setProductos={setProductos} />
            ) : (
                <h3 className="m-5 text-justify text-center font-weight-bold">
                    Solamente los administradores pueden agregar productos
                </h3>
            )}
        </div>
    );

    const loginForm = () => (
        <div className="container">
            <Notification mensaje={errorMessage} />
            <Form onSubmit={handleLogin} className="mt-5">
                <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                >
                    <Form.Label>Usuario</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Raul123"
                        value={username}
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPlaintextPassword">
                    <Form.Label column sm="2">
                        Contraseña
                    </Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </Form.Group>
                <Button className="mt-3" type="submit" variant="primary">
                    Iniciar Sesión
                </Button>
            </Form>
        </div>
    );

    return (
        <>
            {/*{user === null && loginForm()}
      {user !== null && productsForm()} */}

            {user === null ? (
                loginForm()
            ) : (
                <div>
                    <p className="mt-3 mx-3 text-justify text-left font-weight-light">
                        {user.name} logged-in
                    </p>
                    {productsForm()}
                </div>
            )}
        </>
    );
}

export default App;
