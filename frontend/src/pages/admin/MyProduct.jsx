import { useEffect,useState } from "react";
import API from "../../services/api.js";

const ManageProducts = () => {

  const [products,setProducts] = useState([]);

  useEffect(()=>{

    const fetchProducts = async ()=>{

      const { data } = await API.get("/products");

      setProducts(data);

    };

    fetchProducts();

  },[]);

  const deleteHandler = async(id)=>{

    await API.delete(`/products/${id}`);

    setProducts(products.filter(p=>p._id !== id));

  };

  return (

    <div className="p-10">

      <h1 className="text-2xl mb-6">Manage Products</h1>

      <table className="w-full border">

        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>

          {products.map(p=>(
            <tr key={p._id}>

              <td>{p.name}</td>
              <td>{p.price}</td>

              <td>
                <button
                  onClick={()=>deleteHandler(p._id)}
                  className="bg-red-500 text-white px-3 py-1"
                >
                  Delete
                </button>
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>

  );

};

export default ManageProducts;