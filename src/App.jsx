import { useState, useEffect } from "react";
import "./App.css";
import Notification from "./components/Notificactions";
import InputArea from "./InputArea";
import ListArea from "./ListArea";
import loginService from "./services/login";
import productService from "./services/productos";

function App() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const [user, setUser] = useState(null);
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem("loggedAppUser");
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            console.log("User: ", user);
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
            <InputArea productos={productos} />
        </div>
    );

    const loginForm = () => (
        <div className="container">
            <Notification mensaje={errorMessage} />
            <form onSubmit={handleLogin}>
                <div>
                    username
                    <input
                        type="text"
                        value={username}
                        name="Username"
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    password
                    <input
                        type="password"
                        value={password}
                        name="Password"
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button type="submit">login</button>
            </form>
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
