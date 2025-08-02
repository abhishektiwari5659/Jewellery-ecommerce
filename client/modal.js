document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById("productModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalImage = document.getElementById("modalImage");
    const modalPrice = document.getElementById("modalPrice");
    const modalDescription = document.getElementById("modalDescription");
    const span = document.getElementsByClassName("close")[0];

    const products = [
        { id: 1, title: "Product 1", image: "IMG20240626094248.jpg", price: "199.99", description: "Description of Product 1" },
        { id: 2, title: "Product 2", image: "IMG20240626112752.jpg", price: "299.99", description: "Description of Product 2" },
        { id: 3, title: "Product 3", image: "IMG20240626114924.jpg", price: "399.99", description: "Description of Product 3" },
    ];

    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            const product = products.find(p => p.id == productId);

            modalTitle.innerText = product.title;
            modalImage.src = product.image;
            modalPrice.innerText = product.price;
            modalDescription.innerText = product.description;

            modal.style.display = "block";
        });
    });

    span.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});
