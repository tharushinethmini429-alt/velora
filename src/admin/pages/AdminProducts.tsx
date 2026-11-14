import { useEffect, useState } from "react";
import { Search, Package, Plus, X, Pencil, Trash2 } from "lucide-react";
import type { FormEvent } from "react";
import AdminLayout from "../layouts/AdminLayout";

type Product = {
    _id: string;
    name: string;
    category: string;
    price: number;
    originalPrice?: number;
    image: string;
    description?: string;
    stock: number;
    isFeatured: boolean;
};

function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    originalPrice: "",
    image: "",
    stock: "",
    isFeatured: false,
});
    
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState("");

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState("");

    useEffect(() => {
        if (!imageFile) {
            setImagePreview("");
            return;
        }
        const previewUrl = URL.createObjectURL(imageFile);
        setImagePreview(previewUrl);
        return () => URL.revokeObjectURL(previewUrl);
    }, [imageFile]);
    
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/products"
                );
                if (!response.ok) {
                    throw new Error("Failed to load products.");
                }
                const data: Product[] = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Products error:", error);
                setError("Could not load products. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleEditProduct = (product: Product) => {
    setEditingProduct(product);

    setFormData({
        name: product.name,
        category: product.category,
        description: product.description || "",
        price: String(product.price),
        originalPrice: product.originalPrice
            ? String(product.originalPrice)
            : "",
        image: product.image,
        stock: String(product.stock),
        isFeatured: product.isFeatured,
    });

    setImageFile(null);
    setFormError("");
};

const handleDeleteProduct = async (productId: string) => {
    const confirmed = window.confirm(
        "Are you sure you want to delete this product?"
    );
    if (!confirmed) return;
    try {
        const token = sessionStorage.getItem("velora_admin_token");
        if (!token) {
            throw new Error("Please log in again.");
        }
        const response = await fetch(
            `http://localhost:5000/api/products/${productId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || "Failed to delete product.");
        }
        setProducts((previousProducts) =>
            previousProducts.filter((product) => product._id !== productId)
        );
    } catch (error) {
        alert(
            error instanceof Error ? error.message : "Something went wrong."
        );
    }
};

    const handleUpdateProduct = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!editingProduct) return;
        setSaving(true);
        setFormError("");
        
        try {
            const token = sessionStorage.getItem("velora_admin_token");
            if (!token) {
                throw new Error("Please log in again.");
            }
            let imageUrl = formData.image;
            if (imageFile) {
                const uploadData = new FormData();
                uploadData.append("image", imageFile);
                const uploadResponse = await fetch(
                    "http://localhost:5000/api/products/upload-image",
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        body: uploadData,
                    }
                );
                
                const uploadResult = await uploadResponse.json();
                if (!uploadResponse.ok) {
                    throw new Error(uploadResult.message || "Image upload failed.");
                }
                imageUrl = uploadResult.imageUrl;
            }
            if (!imageUrl.trim()) {
                throw new Error("Please provide a product image.");
            }
            if (
                formData.originalPrice &&
                Number(formData.originalPrice) <= Number(formData.price)
            ) {
                throw new Error("Original price must be higher than the selling price.");
            }
            const response = await fetch(
                `http://localhost:5000/api/products/${editingProduct._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        ...formData,
                        image: imageUrl,
                        price: Number(formData.price),
                        originalPrice: formData.originalPrice.trim()
                        ? Number(formData.originalPrice)
                        : undefined,
                        stock: Number(formData.stock),
                    }),
                }
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to update product.");
            }
            setProducts((previousProducts) =>
                previousProducts.map((product) =>
                    product._id === data._id ? data : product
        )
    );
    setEditingProduct(null);
    setShowAddForm(false);
    setImageFile(null);
    setFormData({
        name: "",
        category: "",
        description: "",
        price: "",
        originalPrice: "",
        image: "",
        stock: "",
        isFeatured: false,
    });
} catch (error) {
    setFormError(
        error instanceof Error ? error.message : "Something went wrong."
    );
} finally {
    setSaving(false);
}
};

    const handleAddProduct = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSaving(true);
        setFormError("");
        try {
            const token = sessionStorage.getItem("velora_admin_token");
            if (!token) {
                throw new Error("Please log in again.");
            }
            let imageUrl = formData.image;
            
            // Upload device image to Cloudinary first
            if (imageFile) {
                const uploadData = new FormData();
                uploadData.append("image", imageFile);
                
                const uploadResponse = await fetch(
                    "http://localhost:5000/api/products/upload-image",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: uploadData,
                }
            );
            const uploadResult = await uploadResponse.json();
            if (!uploadResponse.ok) {
                throw new Error(uploadResult.message || "Image upload failed.");
            }
            imageUrl = uploadResult.imageUrl;
        }
        if (!imageUrl.trim()) {
            throw new Error("Please provide an image URL or upload an image.");
        }
        if (
            formData.originalPrice &&
            Number(formData.originalPrice) <= Number(formData.price)
        ) {
            throw new Error("Original price must be higher than the selling price.");
        }

        // Save product
        const response = await fetch("http://localhost:5000/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                ...formData,
                image: imageUrl,
                price: Number(formData.price),
                originalPrice: formData.originalPrice
                    ? Number(formData.originalPrice)
                    : undefined,
                stock: Number(formData.stock),
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to add product.");
        }

        setProducts((previousProducts) => [...previousProducts, data]);

        setFormData({
            name: "",
            category: "",
            description: "",
            price: "",
            originalPrice: "",
            image: "",
            stock: "",
            isFeatured: false,
        });

        setImageFile(null);
        setShowAddForm(false);

    } catch (error) {
        setFormError(
            error instanceof Error ? error.message : "Something went wrong."
        );
    } finally {
        setSaving(false);
    }
};
    
    const filteredProducts = products.filter((product) =>
        `${product.name} ${product.category}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
    <AdminLayout>
        <header className="mb-10">
            <p className="text-sm text-[#9A8574]">Administration / Store Management</p>
            <h1 className="font-serif text-3xl text-[#302721] mt-2">Product Management</h1>
            <p className="text-sm text-[#81766C] mt-2">Manage your Velora store products here.</p>
            </header>
            
            <section className="bg-white rounded-2xl p-6 border border-[#EDE5DB] shadow-sm">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                    <div>
                        <h2 className="font-serif text-xl text-[#302721]">All Products</h2>
                        <p className="text-sm text-[#81766C] mt-1">{products.length} products in your store</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A8574]"/>
                            <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full md:w-64 pl-10 pr-4 py-3 border border-[#EDE5DB] rounded-lg text-sm outline-none focus:border-[#B18A60]"/>
                        </div>
                        
                        <button 
                        onClick={() => {
                            setEditingProduct(null);
                            setFormData({
                                name: "",
                                category: "",
                                description: "",
                                price: "",
                                originalPrice: "",
                                image: "",
                                stock: "",
                                isFeatured: false,
                            });
                            setImageFile(null);
                            setFormError("");
                            setShowAddForm(true);
                        }}
                        className="flex items-center justify-center gap-2 px-5 py-3 bg-[#B18A60] text-white rounded-lg text-sm hover:bg-[#8E6945] transition-all">
                            <Plus size={18}></Plus>Add Product
                        </button>
                    </div>
                </div>
                
                {(showAddForm || editingProduct) && (
                    <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="mb-8 bg-[#FAF8F5] border border-[#EDE5DB] rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-serif text-xl text-[#302721]">{editingProduct ? "Edit Product" : "Add New Product"}</h3>
                            <button type="button" onClick={() => {
                                setShowAddForm(false);
                                setEditingProduct(null);
                                setImageFile(null);
                                setFormError("");
                            }}>
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <input required placeholder="Product name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="p-3 border rounded-lg"/>
                            
                            <select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="p-3 border rounded-lg bg-white">
                                <option value="">Select category</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Bags">Bags</option>
                                <option value="Shoes">Shoes</option>
                                <option value="Accessories">Accessories</option>
                            </select>
                            <input required type="number" min="0" step="0.01" placeholder="Price ($)" value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="p-3 border rounded-lg"/>
                            
                            <input type="number" min="0" step="0.01" placeholder="Original price ($) - optional" value={formData.originalPrice}
                            onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })} className="p-3 border rounded-lg"/>
                            
                            <input required type="number" min="0" step="1" placeholder="Available stock" value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            className="p-3 border rounded-lg"/>
                            
                            <div className="md:col-span-2 space-y-4">
                                <div>
                                    <label className="block text-sm text-[#302721] mb-2">Product Image URL</label>
                                    <input type="url" placeholder="Paste product image URL" value={formData.image} onChange={(e) => {
                                        setFormData({ ...formData, image: e.target.value });
                                        setImageFile(null);
                                    }}
                                    className="w-full p-3 border rounded-lg" disabled={!!imageFile}/>
                                </div>
                                <div className="text-center text-sm text-[#9A8574]">OR</div>
                                <div>
                                    <label className="block text-sm text-[#302721] mb-2">Upload Image From Your Device</label>
                                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        if (file.size > 5 * 1024 * 1024) {
                                            setFormError("Image size must be less than 5 MB.");
                                            e.target.value = "";
                                            return;
                                        }
                                        setFormError("");
                                        setFormData({ ...formData, image: "" });
                                        setImageFile(file);
                                    }}
                                    className="w-full p-3 border rounded-lg bg-white"/>
                                    <p className="text-xs text-[#9A8574] mt-2">JPG, PNG or WebP. Maximum size: 5 MB.</p>
                                </div>
                                
                                {imagePreview && (
                                    <div>
                                        <p className="text-sm text-[#302721] mb-2">Image Preview</p>
                                        <img src={imagePreview} alt="Product preview" className="w-32 h-40 object-cover rounded-lg border"/>
                                    </div>
                                )}
                            </div>

                            <textarea required placeholder="Product description" value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4}
                            className="md:col-span-2 p-3 border rounded-lg resize-none"/>
                            
                            <label className="md:col-span-2 flex items-center gap-3 text-sm">
                            <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}/>
                            Feature this product on the store
                            </label>
                        </div>
                        
                        {formError && (
                            <p className="text-sm text-red-600 mt-4">{formError}</p>
                        )}
                        
                        <div className="flex justify-end gap-3 mt-6">
                            <button type="button" onClick={() => {
                                setShowAddForm(false);
                                setEditingProduct(null);
                                setImageFile(null);
                                setFormError("");
                            }}
                            className="px-5 py-3 border rounded-lg">
                                Cancel
                            </button>

                            <button type="submit" disabled={saving} className="px-6 py-3 bg-[#B18A60] text-white rounded-lg disabled:opacity-50">
                                {saving
                                ? "Saving..."
                                : editingProduct
                                ? "Update Product"
                                : "Save Product"
                                }
                            </button>
                        </div>
                    </form>
                )}

                {loading ? (
                    <p className="text-sm text-[#81766C] py-8 text-center">Loading products...</p>
                ) : error ? (
                    <p className="text-sm text-red-600 py-8 text-center">{error}</p>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                        <Package size={36} className="mx-auto text-[#B18A60] mb-3"/>
                        <p className="text-[#302721] font-medium">{search ? "No matching products found." : "No products yet."}</p>
                        <p className="text-sm text-[#9A8574] mt-2">
                            {search
                            ? "Try another search."
                            : "Your products will appear here once added."}
                        </p>
                    </div>
                ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-[#EDE5DB] text-xs uppercase tracking-wider text-[#9A8574]">
                                <th className="py-4 pr-4">Product</th>
                                <th className="py-4 px-4">Category</th>
                                <th className="py-4 px-4">Price</th>
                                <th className="py-4 px-4">Stock</th>
                                <th className="py-4 pl-4">Status</th>
                                <th className="py-4 px-4">Actions</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product._id} className="border-b border-[#F0EBE5] last:border-0">
                                    <td className="py-4 pr-4">
                                        <div className="flex items-center gap-3 min-w-52">
                                            <img src={product.image} alt={product.name} className="w-12 h-14 object-cover rounded-lg bg-[#F5EFE7]"/>
                                            <span className="text-sm font-medium text-[#302721]">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-[#81766C]">{product.category}</td>
                                    <td className="py-4 px-4 text-sm font-medium text-[#302721]">${product.price.toFixed(2)}</td>
                                    <td className="py-4 px-4 text-sm text-[#81766C]">{product.stock}</td>
                                    
                                    <td className="py-4 pl-4">
                                        <span className={`text-xs px-3 py-1 rounded-full ${
                                            product.stock > 0
                                            ? "bg-green-50 text-green-700"
                                            : "bg-red-50 text-red-600"
                                        }`}>
                                            {product.stock > 0 ? "In Stock" : "Out of Stock"}
                                        </span>
                                    </td>

                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-4">
                                            <button type="button" onClick={() => handleEditProduct(product)}
                                            className="flex items-center gap-2 text-sm text-[#B18A60] hover:text-[#8E6945]">
                                                <Pencil size={16} />
                                                Edit
                                            </button>
                                            
                                            <button type="button" onClick={() => handleDeleteProduct(product._id)}
                                            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700">
                                                <Trash2 size={16} />
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    </AdminLayout>
);
}

export default AdminProducts;
