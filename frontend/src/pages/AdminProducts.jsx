import { useEffect, useState } from "react";
import axios from "axios";

function AdminProducts() {
  const [products, setProducts] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    rating: "",
    description: "",
    images: [],
    stock: "",
  });

  const openEditModal = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      rating: product.rating,
      description: product.description,
      images: product.images || [],
      stock: product.stock,
    });

    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);

    try {
      const token = localStorage.getItem("token");

      const uploadedImages = [];

      for (const file of files) {
        const data = new FormData();
        data.append("image", file);

        const res = await axios.post(
          "http://localhost:8080/admin/upload",
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
        uploadedImages.push(res.data.url);
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
      }));
    } catch (err) {
      console.log(err);
      toast.error("Image upload failed");
    }
  };

  const createProduct = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:8080/admin/products",
        {
          ...formData,

          price: Number(formData.price),

          rating: Number(formData.rating),

          stock: Number(formData.stock),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setShowModal(false);

      fetchProducts();

      setFormData({
        name: "",
        price: "",
        category: "",
        rating: "",
        description: "",
        images: [],
        stock: "",
      });

      toast.success("Product created");
    } catch (err) {
      console.log(err);
    }
  };

  const updateProduct = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:8080/admin/products/${editingProduct.id}`,
        {
          ...formData,

          price: Number(formData.price),

          rating: Number(formData.rating),

          stock: Number(formData.stock),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      fetchProducts();

      setShowModal(false);

      setEditingProduct(null);

      toast.success("Product updated");
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/admin/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchProducts();
      toast.success("Product deleted");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/products");
      setProducts(res.data.products);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Manage Products
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition"
        >
          Add Product
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="text-left p-4 text-gray-600 dark:text-gray-300">
                Product
              </th>

              <th className="text-left p-4 text-gray-600 dark:text-gray-300">
                Category
              </th>

              <th className="text-left p-4 text-gray-600 dark:text-gray-300">
                Price
              </th>

              <th className="text-left p-4 text-gray-600 dark:text-gray-300">
                Actions
              </th>

              <th className="text-left p-4 text-gray-600 dark:text-gray-300">
                Stock
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t dark:border-gray-700">
                <td className="p-4 align-middle">
                  <div className="flex items-center gap-4">
                    <img
                      src={product.images[0] ? product.images[0] : null}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />

                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {product.name}
                      </p>

                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="p-4 align-middle text-gray-700 dark:text-gray-200">
                  {product.category}
                </td>

                <td className="p-4 align-middle text-gray-700 dark:text-gray-200">
                  ₹{product.price}
                </td>

                <td className="p-4 align-middle">
                  <div className="flex items-center gap-3">
                    {/* EDIT BUTTON */}
                    <button
                      onClick={() => openEditModal(product)}
                      className="
      flex items-center gap-2

      bg-amber-100
      hover:bg-amber-200

      text-amber-700

      px-4 py-2.5

      rounded-xl

      font-medium text-sm

      transition-all duration-200

      hover:scale-105
    "
                    >
                      ✏️ Edit
                    </button>

                    {/* DELETE BUTTON */}
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="
      flex items-center gap-2

      bg-red-100
      hover:bg-red-200

      text-red-600

      px-4 py-2.5

      rounded-xl

      font-medium text-sm

      transition-all duration-200

      hover:scale-105
    "
                    >
                      🗑 Delete
                    </button>
                  </div>
                </td>

                <td className="p-4 text-gray-700 dark:text-gray-200">
                  {product.stock}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 overflow-y-auto">
          <div className="min-h-screen flex items-center justify-center p-4">
            <div
              className="
          bg-white dark:bg-gray-800
          w-full max-w-2xl
          rounded-2xl shadow-2xl
          p-6 sm:p-8
          my-10
        "
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {editingProduct ? "Edit Product" : "Add Product"}
                </h2>

                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
                  }}
                  className="
              text-gray-500 hover:text-red-500
              text-3xl leading-none
            "
                >
                  ×
                </button>
              </div>

              {/* FORM */}
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="
              w-full p-3 rounded-xl border
              dark:bg-gray-700
              dark:border-gray-600
              dark:text-white
              outline-none
              focus:ring-2 focus:ring-blue-500
            "
                />

                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleChange}
                  className="
              w-full p-3 rounded-xl border
              dark:bg-gray-700
              dark:border-gray-600
              dark:text-white
              outline-none
              focus:ring-2 focus:ring-blue-500
            "
                />

                <input
                  type="text"
                  name="category"
                  placeholder="Category"
                  value={formData.category}
                  onChange={handleChange}
                  className="
              w-full p-3 rounded-xl border
              dark:bg-gray-700
              dark:border-gray-600
              dark:text-white
              outline-none
              focus:ring-2 focus:ring-blue-500
            "
                />

                <input
                  type="number"
                  step="0.1"
                  name="rating"
                  placeholder="Rating"
                  value={formData.rating}
                  onChange={handleChange}
                  className="
              w-full p-3 rounded-xl border
              dark:bg-gray-700
              dark:border-gray-600
              dark:text-white
              outline-none
              focus:ring-2 focus:ring-blue-500
            "
                />

                <input
                  type="number"
                  name="stock"
                  placeholder="Stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="
    w-full p-3 rounded-xl border
    dark:bg-gray-700
    dark:border-gray-600
    dark:text-white
    outline-none
    focus:ring-2 focus:ring-blue-500
  "
                />

                <textarea
                  name="description"
                  placeholder="Description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="
              w-full p-3 rounded-xl border
              dark:bg-gray-700
              dark:border-gray-600
              dark:text-white
              outline-none
              focus:ring-2 focus:ring-blue-500
            "
                />

                {/* IMAGE SECTION */}

                <div className="space-y-5">
                  {/* FILE INPUT */}

                  <div
                    className="
      border-2 border-dashed

      border-gray-300
      dark:border-gray-600

      rounded-2xl

      p-6

      bg-gray-50
      dark:bg-gray-700/40
    "
                  >
                    <input
                      type="file"
                      multiple
                      onChange={handleUpload}
                      className="
        w-full

        dark:text-white
      "
                    />

                    <p
                      className="
        text-sm

        text-gray-500
        dark:text-gray-400

        mt-3
      "
                    >
                      Upload multiple product images for thumbnail gallery and
                      zoom preview.
                    </p>
                  </div>

                  {/* IMAGE PREVIEW GRID */}

                  {formData.images.length > 0 && (
                    <div>
                      <div
                        className="
            flex items-center justify-between

            mb-4
          "
                      >
                        <h3
                          className="
              font-semibold

              text-gray-800
              dark:text-white
            "
                        >
                          Product Gallery
                        </h3>

                        <p
                          className="
              text-sm

              text-gray-500
              dark:text-gray-400
            "
                        >
                          {formData.images.length} images
                        </p>
                      </div>

                      <div
                        className="
            grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4

            gap-4
          "
                      >
                        {formData.images
                          .filter((img) => img)
                          .map((img, index) => (
                            <div
                              key={index}
                              className="
                    relative

                    group

                    rounded-2xl

                    overflow-hidden

                    border border-gray-200
                    dark:border-gray-700

                    bg-white
                    dark:bg-gray-800

                    shadow-sm

                    hover:shadow-xl

                    transition-all duration-300
                  "
                            >
                              {/* IMAGE */}

                              <img
                                src={img}
                                alt={`Preview ${index}`}
                                className="
                      w-full h-36

                      object-cover
                    "
                              />

                              {/* OVERLAY */}

                              <div
                                className="
                      absolute inset-0

                      bg-black/0
                      group-hover:bg-black/20

                      transition
                    "
                              />

                              {/* PRIMARY BADGE */}

                              {index === 0 && (
                                <div
                                  className="
                          absolute top-3 left-3

                          px-2 py-1

                          rounded-full

                          bg-blue-600

                          text-white

                          text-xs font-medium
                        "
                                >
                                  Main
                                </div>
                              )}

                              {/* REMOVE BUTTON */}

                              <button
                                type="button"
                                onClick={() => {
                                  const updatedImages = formData.images.filter(
                                    (_, i) => i !== index,
                                  );

                                  setFormData({
                                    ...formData,
                                    images: updatedImages,
                                  });
                                }}
                                className="
                      absolute top-3 right-3

                      w-9 h-9

                      rounded-full

                      bg-red-500
                      hover:bg-red-600

                      text-white

                      flex items-center justify-center

                      opacity-0
                      group-hover:opacity-100

                      transition-all duration-300
                    "
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* BUTTON */}
                <button
                  onClick={editingProduct ? updateProduct : createProduct}
                  className="
              w-full bg-blue-600
              hover:bg-blue-700
              text-white py-3
              rounded-xl
              font-semibold
              transition
            "
                >
                  {editingProduct ? "Update Product" : "Create Product"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
