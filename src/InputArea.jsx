import { useEffect, useState } from "react";
import productService from "./services/productos";

const InputArea = ({productos, setProductos}) => {
    const [items, setItems] = useState(productos);
    const [newItem, setNewItem] = useState("");
    const [precio, setPrecio] = useState(0);

    useEffect(() => {
		setItems(productos);
    }, [productos]);

    const addItem = (event) => {
        event.preventDefault();

        if (newItem === "" || precio === 0) {
            alert("Por favor, ingrese un producto y un precio");
            return;
        }

        const itemObject = {
            id: items.length + 1,
            producto: newItem,
            precio: precio,
        };

        const dataForApi = {
            producto: newItem,
            precio: precio,
        };

        productService
            .addProduct(dataForApi)
            .then((response) => {
                const newItems = items.concat(itemObject);
                setItems(newItems);
                setProductos(newItems);
                setNewItem("");
                setPrecio(0);
            })
            .catch((error) => {
                console.log("error", error);
            });
    };

    const handleItemChange = (event) => {
        setNewItem(event.target.value);
    };

    return (
        <>
            <form className="row g-4 mt-5" onSubmit={addItem}>
                <div className="col-7">
                    <div className="input-group">
                        <input
                            value={newItem}
                            onChange={handleItemChange}
                            type="text"
                            className="form-control"
                            id="inlineFormInputGroupUsername0"
                            placeholder="...agregar nuevo producto"
                        />
                    </div>
                </div>
                <div className="col-2">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            id="inlineFormInputGroupUsername1"
                            placeholder="precio"
                            value={precio}
                            onChange={(e) => setPrecio(e.target.value)}
                        />
                    </div>
                </div>

                <div className="col-2">
                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>
                </div>
            </form>
        </>
    );
};

export default InputArea;
