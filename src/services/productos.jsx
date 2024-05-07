import axios from "axios";
const baseUrl = "http://localhost:3001/api/products";

const getAllProducts = async () => {
    const response = await axios.get(baseUrl);
    return response.data;
};

const addProduct = async (product) => {
    const response = await axios.post(
        baseUrl,
        { content: product },
        {
            headers: {
                Authorization: `Bearer ${window.localStorage.getItem("token")}`,
            },
        }
    );
    return response.data;
};

export default { getAllProducts, addProduct };
