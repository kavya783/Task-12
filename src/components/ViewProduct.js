import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";

function ViewProduct({ product, show, handleClose }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (product) {
      setName(product.productname);
      setPrice(product.price);
      setCategory(product.category);
    } else {
      setName("No Product Selected");
      setPrice("");
      setCategory("");
    }
  }, [product]);

  return (
    
    <>
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          View Product
        </Modal.Title>

      </Modal.Header>
      <Modal.Body>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title"><b>Product Name:</b>{name}</h5>
            <h6 className="card-text"><b>Price:</b> {price}</h6>
            <h6 className="card-text"><b>Category:</b> {category}</h6>
          </div>
        </div>
      </Modal.Body>
    </Modal>
         

      </> 
  );
}

export default ViewProduct; 