import { useState } from "react";
import API from "../../services/api.js";

const AddProduct = () => {

  const [name,setName] = useState("");
  const [brand,setBrand] = useState("");
  const [price,setPrice] = useState("");

  const submitHandler = async (e) => {

    e.preventDefault();

    const { data } = await API.post("/products",{
      name,
      brand,
      price,
      category:"Electronics",
      description:"Sample product",
      images:["/uploads/sample.png"],
      countInStock:10
    });

    alert("Product Created");

  };

  return (

    <div className="p-10">

      <h1 className="text-2xl mb-6">Add Product</h1>

      <form onSubmit={submitHandler} className="space-y-4">

        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          className="border p-2 w-full"
        />

        <input
          type="text"
          placeholder="Brand"
          value={brand}
          onChange={(e)=>setBrand(e.target.value)}
          className="border p-2 w-full"
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e)=>setPrice(e.target.value)}
          className="border p-2 w-full"
        />

        <button
          className="bg-green-500 text-white px-6 py-2"
        >
          Create Product
        </button>

      </form>

    </div>

  );

};

export default AddProduct;