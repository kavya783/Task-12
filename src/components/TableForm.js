import React, { useState, useEffect } from "react";
import ProductForm from "./ProductForm";
import ViewProduct from "./ViewProduct";
import { collection, getDocs, doc, deleteDoc, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import '../App.css';
import ActionButton from "./ActionButton";
  
function TableForm() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const fetchProducts = async () => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const productSnap = await getDocs(q);
    const productList = productSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(productList); 
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchProducts();
  }, []);



  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "products", id));
        setProducts(prev => prev.filter(p => p.id !== id));
        alert("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product!");
      }
    }
  };


  const filteredProducts = products.filter(p =>
    p.productname.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.price.toString().includes(search)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <>


      <form className="container d-md-block d-none  p-4 mb-5 mt-5 pt-5 rounded ">
        <div className=" d-md-block d-none">
          <h2 className="text-center text-danger text-decoration-underline mb-3 ">
            CRUD Operations in React
          </h2>
        </div>

        <div className="w-75 mx-auto">

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="text-success mb-0">Product List:</h2>

            <ActionButton
              text="Add Product"
              icon="bi-plus-circle"
              className="btn-warning"
              onClick={() => {
                setSelectedProduct(null);
                setShowEdit(true);
              }}
            />
          </div>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <p className="mb-0 fw-bold">
              Showing Products: <b>{filteredProducts.length}</b>
            </p>

            <div className="d-flex align-items-center">
              <label className="fw-bold me-2">Search:</label>

              <input
                type="text"
                placeholder="Search product..."
                className="form-control border border-black"
                style={{ maxWidth: "300px" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        <ProductForm
          type={selectedProduct ? "edit" : "add"}
          product={selectedProduct}
          fetchProducts={fetchProducts}
          show={showEdit}
          handleClose={() => setShowEdit(false)}
        />

        <ViewProduct
          product={selectedProduct}
          show={showView}
          handleClose={() => setShowView(false)}
          
        />


        <div>
          {filteredProducts.length === 0 ? (
            <p className="text-center text-danger">No products found.</p>
          ) : (
            <table className="table table-bordered table-sm align-middle border-dark text-center w-75 mx-auto">
              <thead className="table-dark">
                <tr>
                  <th>S.no</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th style={{ width: "200px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((item, index) => (
                  <tr key={item.id}>
                    <td className="text-danger fw-bold">{indexOfFirstItem + index + 1}</td>
                    <td>{item.productname}</td>
                    <td>{item.price}</td>
                    <td>{item.category}</td>
                    <td>
                      <ActionButton
                        icon="bi-pencil-square"
                        className="btn-success btn-sm me-1"
                        onClick={() => {
                          setSelectedProduct(item);
                          setShowEdit(true);
                        }}
                      />

                      <ActionButton
                        icon="bi-eye-fill"
                        className="btn-primary btn-sm me-1"
                        onClick={() => {
                          setSelectedProduct(item);
                          setShowView(true);
                        }}
                      />

                      <ActionButton
                        icon="bi-trash3-fill"
                        className="btn-danger btn-sm"
                        onClick={() => handleDelete(item.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {filteredProducts.length > itemsPerPage && (
            <div className="d-flex justify-content-center mt-4">
              <button
                className="btn btn-outline-light me-2"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                 {'<'}
              </button>
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={i}
                    className={`btn mx-1 ${currentPage === page ? "btn-danger" : "btn-outline-light"}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                className="btn btn-outline-light ms-2"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                 {'>'}
              </button>
            </div>
          )}
        </div>
      </form>



      <CardForm
        products={currentProducts}
        filteredLength={filteredProducts.length}
        setSelectedProduct={setSelectedProduct}
        handleDelete={handleDelete}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        setShowEdit={setShowEdit}
        setShowView={setShowView}
        search={search}
        setSearch={setSearch}
      />
    </>
  );
}


function CardForm({
  products,
  filteredLength,
  setSelectedProduct,
  handleDelete,
  currentPage,
  setCurrentPage,
  totalPages,
  itemsPerPage,
  setShowEdit,
  setShowView,
  search,
  setSearch
}) {
  return (
    <div className="container d-md-none">
      <h2 className="text-center text-primary text-decoration-underline mb-4 mt-5">
        CRUD Operations in React
      </h2>


      <div className="d-flex justify-content-between align-items-center mb-3 ">
        <h5 className="text-success ">Product List:</h5>
        <button
          className="btn btn-warning "
          onClick={() => {
            setSelectedProduct(null);
            setShowEdit(true);
          }}
        >
          Add Product
        </button>
      </div>
      <div className="d-flex align-items-center ">
        <label className="me-2 fw-bold">Search: </label>
        <input
          type="text"
          placeholder="Search product..."
          className="form-control w-75 me-2 mt-3 mb-3 border border-black"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <p className="mb-0 fw-bold">
        Showing Products: <b>{filteredLength}</b>
      </p>

      {filteredLength === 0 && (
        <p className="text-center text-danger">No products found.</p>
      )}

      <div className="d-flex flex-column align-items-center ">
        {products.map((item) => (
          <div className="card mb-3 w-100 shadow-sm mt-2 bg-body-tertiary rounded" key={item.id}>
            <div className="card-body">
              <h5 className="card-title fw-semibold mb-3">
                Product: <span className="text-primary">{item.productname}</span>
              </h5>
              <p className="mb-1">
                <strong>Price:</strong> ₹ {item.price}
              </p>

              <p className="mb-3">
                <strong>Category:</strong> {item.category}
              </p>
              <div className="d-flex justify-content-between align-items-center">

                <ActionButton
                  className="btn-success btn-sm ms-1"
                  text="Edit"
                  icon="bi-pencil-square"
                  onClick={() => {
                    setSelectedProduct(item);
                    setShowEdit(true);
                  }}
                />


                <ActionButton
                  className="btn-primary btn-sm"
                  text="View"
                  icon="bi-eye-fill"
                  onClick={() => {
                    setSelectedProduct(item);
                    setShowView(true);
                  }}
                />

                <ActionButton
                  className="btn-danger btn-sm"
                  text="Delete"
                  icon="bi-trash3-fill"
                  onClick={() => handleDelete(item.id)}
                />
              </div>
            </div>
          </div>
        ))}

        {filteredLength > itemsPerPage && (
          <div className="d-flex justify-content-center mt-3">
            <button
              className="btn btn-outline-primary me-2"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              &lt;
            </button>

            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={i}
                  className={`btn mx-1 ${currentPage === page ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              );
            })}

            <button
              className="btn btn-outline-primary ms-2"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TableForm;