const categoryApiUrl = 'http://localhost:5000/api/categories';
const productApiUrl = 'http://localhost:5000/api/products';

// Fetch and display categories
async function fetchCategories() {
    try {
        const response = await fetch(categoryApiUrl);
        const categories = await response.json();
        const categoryTableBody = document.getElementById('categoryTableBody');
        categoryTableBody.innerHTML = '';

        categories.forEach(category => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${category.name}</td>
                <td>${category.description}</td>
                <td class="actions">
                    <button class="edit-btn" onclick="editCategory('${category._id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteCategory('${category._id}')">Delete</button>
                </td>
            `;
            categoryTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

// Save or update a category
async function saveCategory() {
    try {
        const categoryId = document.getElementById('categoryId').value;
        const name = document.getElementById('categoryName').value;
        const description = document.getElementById('categoryDescription').value;

        const categoryData = { name, description };

        const method = categoryId ? 'PUT' : 'POST';
        const url = categoryId ? `${categoryApiUrl}/${categoryId}` : categoryApiUrl;

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(categoryData)
        });

        if (response.ok) {
            alert('Category saved successfully');
            fetchCategories();
            clearCategoryForm();
        } else {
            alert('Failed to save category');
        }
    } catch (error) {
        console.error('Error saving category:', error);
    }
}

// Edit a category
async function editCategory(id) {
    try {
        const response = await fetch(`${categoryApiUrl}/${id}`);
        const category = await response.json();

        document.getElementById('categoryId').value = category._id;
        document.getElementById('categoryName').value = category.name;
        document.getElementById('categoryDescription').value = category.description;
    } catch (error) {
        console.error('Error editing category:', error);
    }
}

// Delete a category
async function deleteCategory(id) {
    try {
        const response = await fetch(`${categoryApiUrl}/${id}`, { method: 'DELETE' });

        if (response.ok) {
            alert('Category deleted successfully');
            fetchCategories();
        } else {
            alert('Failed to delete category');
        }
    } catch (error) {
        console.error('Error deleting category:', error);
    }
}

// Clear the category form
function clearCategoryForm() {
    document.getElementById('categoryId').value = '';
    document.getElementById('categoryName').value = '';
    document.getElementById('categoryDescription').value = '';
}

// Fetch and display products
async function fetchProducts() {
    try {
        const response = await fetch(productApiUrl);
        const products = await response.json();
        const productTableBody = document.getElementById('productTableBody');
        productTableBody.innerHTML = '';

        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.description}</td>
                <td>${product.price}</td>
                <td>${product.status}</td>
                <td><img src="/api/products/${product._id}/image" alt="${product.name}" style="width: 100px;"></td>
                <td class="actions">
                    <button class="edit-btn" onclick="editProduct('${product._id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteProduct('${product._id}')">Delete</button>
                </td>
            `;
            productTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Save or update a product
async function saveProduct() {
    try {
        const productId = document.getElementById('productId').value;
        const name = document.getElementById('productName').value;
        const description = document.getElementById('productDescription').value;
        const price = document.getElementById('productPrice').value;
        const status = document.getElementById('productStatus').value;
        const imageFile = document.getElementById('productImage').files[0];

        let imageData = {};

        if (imageFile) {
            const formData = new FormData();
            formData.append('image', imageFile);

            const imageResponse = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (imageResponse.ok) {
                imageData = await imageResponse.json();
            } else {
                alert('Failed to upload image');
                return;
            }
        }

        const productData = {
            name,
            description,
            price,
            status,
            image: imageData
        };

        const method = productId ? 'PUT' : 'POST';
        const url = productId ? `${productApiUrl}/${productId}` : productApiUrl;

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        if (response.ok) {
            alert('Product saved successfully');
            fetchProducts();
            clearProductForm();
        } else {
            alert('Failed to save product');
        }
    } catch (error) {
        console.error('Error saving product:', error);
    }
}

// Edit a product
async function editProduct(id) {
    try {
        const response = await fetch(`${productApiUrl}/${id}`);
        const product = await response.json();

        document.getElementById('productId').value = product._id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStatus').value = product.status;
        document.getElementById('imagePreview').src = `/api/products/${product._id}/image`;
        document.getElementById('imagePreview').style.display = 'block';
    } catch (error) {
        console.error('Error editing product:', error);
    }
}

// Delete a product
async function deleteProduct(id) {
    try {
        const response = await fetch(`${productApiUrl}/${id}`, { method: 'DELETE' });

        if (response.ok) {
            alert('Product deleted successfully');
            fetchProducts();
        } else {
            alert('Failed to delete product');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}

// Clear the product form
function clearProductForm() {
    document.getElementById('productId').value = '';
    document.getElementById('productName').value = '';
    document.getElementById('productDescription').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productStatus').value = '';
    document.getElementById('productImage').value = '';
    document.getElementById('imagePreview').src = '';
    document.getElementById('imagePreview').style.display = 'none';
}

// Handle image preview
document.getElementById('productImage').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('imagePreview').src = e.target.result;
            document.getElementById('imagePreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        document.getElementById('imagePreview').src = '';
        document.getElementById('imagePreview').style.display = 'none';
    }
});
