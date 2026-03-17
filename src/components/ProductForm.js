
import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap"; 
import { db } from "../firebase";
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";

function ProductForm({ type, product, fetchProducts, show, handleClose }) {
  const [productname, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");


  useEffect(() => {
    if (type === "edit" && product) {
      setProductName(product.productname);
      setPrice(product.price);
      setCategory(product.category);
    } else {
      setProductName("");
      setPrice("");
      setCategory("");
    }
  }, [product, type]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productname) {
      setError("Product name is required");
      return;
    }
    if (!price) {
      setError("Price is required");
      return;
    }
    if (!category) {
      setError("Category is required");
      return;
    }

    setError("");

    try {
      if (type === "add") {
        await addDoc(collection(db, "products"), {
          productname,
          price: Number(price),
          category,
          createdAt: serverTimestamp()
        });
        alert("Product Added Successfully");
      }

      if (type === "edit" && product) {
        const productRef = doc(db, "products", product.id);
        await updateDoc(productRef, {
          productname,
          price: Number(price),
          category
        });
        alert("Product Updated Successfully");
      }

      fetchProducts(); 
      handleClose();   

      
      setProductName(" ");
      setPrice(" ");
      setCategory(" ");
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{type === "add" ? "Add Product" : "Edit Product"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <label className="form-label">Product Name</label>
          <input
            type="text"
            className="form-control"
            value={productname}
            onChange={(e) => setProductName(e.target.value)}
          />
          {error === "Product name is required" && (
            <p className="text-danger">{error}</p>
          )}

          <label className="form-label mt-2">Price</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          {error === "Price is required" && (
            <p className="text-danger">{error}</p>
          )}

          <label className="form-label mt-2">Category</label>
          <input
            type="text"
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          {error === "Category is required" && (
            <p className="text-danger">{error}</p>
          )}

          <Button type="submit" className="mt-3" variant="success">
            {type === "add" ? "Add Product" : "Update Product"}
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default ProductForm;