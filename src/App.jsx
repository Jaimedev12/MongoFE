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

// function TextControlsExample() {
//   return (
//     <Form>
//       <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
//         <Form.Label>Email address</Form.Label>
//         <Form.Control type="email" placeholder="name@example.com" />
//       </Form.Group>
//       <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
//         <Form.Label>Example textarea</Form.Label>
//         <Form.Control as="textarea" rows={3} />
//       </Form.Group>
//     </Form>
//   );
// }

// export default TextControlsExample;

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
            setErrorMessage("Wrong credentials");
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
                <p>Solamente los administradores pueden agregar productos</p>
            )}
        </div>
    );

    const loginForm = () => (
        <div className="container">
            <Notification mensaje={errorMessage} />
            <Form onSubmit={handleLogin}>
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
                <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formPlaintextPassword"
                >
                    <Form.Label column sm="2">
                        Contraseña
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={({ target }) => setPassword(target.value)}
                        />
                    </Col>
                </Form.Group>
                <Button type="submit" variant="primary">
                    Primary
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
                    <p>{user.name} logged-in</p>
                    {productsForm()}
                </div>
            )}
        </>
    );
}

export default App;
