document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById("productModal");
    const modalContent = document.querySelector(".modal-content");
    const modalImage = modal.querySelector(".modal-image");
    const modalName = modal.querySelector(".modal-name");
    const modalPrice = modal.querySelector(".modal-price");
    const modalDescription = modal.querySelector(".modal-description");
    const closeBtn = document.querySelector(".close");

    // Function to open the modal with product details
    function openModal(product) {
        const productName = product.getAttribute('data-name');
        const productPrice = product.getAttribute('data-price');
        const productDescription = product.getAttribute('data-description');
        const productImage = product.getAttribute('data-image');

        console.log('Image URL:', productImage); // Debugging

        modalImage.src = productImage;
        modalName.textContent = productName;
        modalPrice.textContent = productPrice;
        modalDescription.textContent = productDescription;

        modal.style.display = "block";
    }

    // Handle "View Details" button click
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', event => {
            const product = event.target.closest('.product');
            openModal(product);
        });
    });

    // Handle "Add to Cart" button click
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', event => {
            const product = event.target.closest('.product');
            const productName = product.getAttribute('data-name');
            const productPrice = product.getAttribute('data-price');
            const productImage = product.getAttribute('data-image');

            // Create a product object
            const productData = {
                name: productName,
                price: productPrice,
                image: productImage
            };

            // Get existing cart items from localStorage or initialize an empty array
            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            // Add the new product to the cart
            cart.push(productData);

            // Save the updated cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));

            // Optionally: Provide feedback to the user (e.g., show an alert or update cart icon)
            alert('Product added to cart!');
        });
    });

    // Close the modal when the close button is clicked
    closeBtn.addEventListener('click', () => {
        modal.style.display = "none";
    });

    // Close the modal when clicking outside of it
    window.addEventListener('click', event => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
});
