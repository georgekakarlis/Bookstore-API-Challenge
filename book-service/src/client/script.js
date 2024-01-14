//each time DOM is loaded we fetchbooks :)
document.addEventListener('DOMContentLoaded', function() {
    fetchBooks();
});

// fetch books to make it "real-time".
function fetchBooks() {
    fetch('/book') 
        .then(response => response.json())
        .then(books => {
            const tableBody = document.getElementById('booksTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = ''; 
            books.forEach(book => {
                const row = tableBody.insertRow();
                row.innerHTML = `
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.isbn}</td>
                    <td>${book.price}</td>
                    <td>${book.quantity}</td>
                    <td>${book.threshold}</td>
                    <td>
                        <button onclick="editBook(${book.id})">Edit</button> 
                        <button class="deletebutton"onclick="deleteBook(${book.id})">Delete</button>
                    </td>
                `;
            });
        })
        .catch(error => console.error('Error fetching books:', error));
}


// edit button modal. REALLY BASIC :/
function createEditModal(book) {
    const modal = document.createElement('div');
    modal.id = 'editBookModal';
    modal.className = 'modal';

    // Modal content
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-button" onclick="closeModal()">&times;</span>
            <h2>Edit Book - ${book.title}</h2>
            <form id="editBookForm">
                <input type="hidden" id="editBookId" value="${book.id}">
                <label for="title">Title:</label>
                <input type="text" id="title" name="title" value="${book.title}" required><br><br>
                <label for="author">Author:</label>
                <input type="text" id="author" name="author" value="${book.author}" required><br><br>
                <label for="isbn">ISBN:</label>
                <input type="text" id="isbn" name="isbn" value="${book.isbn}" required><br><br>
                <label for="price">Price:</label>
                <input type="number" id="price" name="price" value="${book.price}" required><br><br>
                <label for="quantity">Quantity:</label>
                <input type="number" id="quantity" name="quantity" value="${book.quantity}" required><br><br>
                <label for="threshold">Threshold:</label>
                <input type="number" id="threshold" name="threshold" value="${book.threshold}" required><br><br>
                <button type="button" onclick="submitEdit()">Edit</button>
                <button type="button" onclick="closeModal()">Cancel</button>
            </form>
        </div>
    `;

    // Append the modal to the body
    document.body.appendChild(modal);
}

// the editbook function initiates the process to edit the specific book by first fetching the id. Could be better since it takes 
// a bit more KBs on the extra request but could not find a better solution to be honest :/
function editBook(bookId) {
    fetch(`/book/${bookId}`)
        .then(response => response.json())
        .then(book => {
            createEditModal(book);
            openModal();
        })
        .catch(error => console.error('Error fetching book:', error));
}

// edit book modal stuff
function openModal() {
    const modal = document.getElementById('editBookModal');
    if (modal) {
        modal.style.display = 'block';
    }
}
function closeModal() {
    const modal = document.getElementById('editBookModal');
    if (modal) {
        modal.remove();
    }
}

// submitedit takes the values and PUTs(pun intended) them to the backend to edit them. all or separate 
function submitEdit() {
    const bookId = document.getElementById('editBookId').value;
    const bookData = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        isbn: document.getElementById('isbn').value,
        price: parseFloat(document.getElementById('price').value),
        quantity: parseInt(document.getElementById('quantity').value),
        threshold: parseInt(document.getElementById('threshold').value)
    };

    fetch(`/book/${bookId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
    })
    .then(response => {
        if (response.ok) {
            closeModal();
            fetchBooks(); // Refresh the book list "real-time" :)
        } else {
            console.error('Error updating book');
        }
    })
    .catch(error => console.error('Error updating book:', error));
}

// basic deletion of a book based on the id of a book
function deleteBook(bookId) {
    console.log('Deleting book:', bookId);
    fetch(`/book/${bookId}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                fetchBooks(); // Refresh the book list "real-time" :)
            } else {
                console.error('Error deleting book');
            }
        })
        .catch(error => console.error('Error deleting book:', error));
}



 //  Modal container for adding a book
function showAddBookModal() {
    const addModal = document.createElement('div');
    addModal.id = 'addBookModal';
    addModal.className = 'modal';

    // Modal content to add the book
    addModal.innerHTML = `
        <div class="modal-content">
            <span class="close-button" onclick="closeAddModal()">&times;</span>
            <h2>Add New Book</h2>
            <form id="addBookForm">
                <label for="addTitle">Title:</label>
                <input type="text" id="addTitle" name="title" required><br><br>
                <label for="addAuthor">Author:</label>
                <input type="text" id="addAuthor" name="author" required><br><br>
                <label for="addIsbn">ISBN:</label>
                <input type="text" id="addIsbn" name="isbn" required><br><br>
                <label for="addPrice">Price:</label>
                <input type="number" id="addPrice" name="price" required><br><br>
                <label for="addQuantity">Quantity:</label>
                <input type="number" id="addQuantity" name="quantity" required><br><br>
                <label for="addThreshold">Threshold:</label>
                <input type="number" id="addThreshold" name="threshold" required><br><br>
                <button type="button" onclick="submitNewBook()">Add</button>
                <button type="button" onclick="closeAddModal()">Cancel</button>
            </form>
        </div>
    `;
    

    document.body.appendChild(addModal);
    openAddModal();
}

//This whole add-a-new-book modal is a strange copy-pasta but more strangely works :) 
function openAddModal() {
    const modal = document.getElementById('addBookModal');
    modal.style.display = 'block';
}
function closeAddModal() {
    const modal = document.getElementById('addBookModal');
    if (modal) {
        modal.remove();
    }
}

//Basic form submission to add the new book
function submitNewBook() {
    const newBookData = {
        title: document.getElementById('addTitle').value,
        author: document.getElementById('addAuthor').value,
        isbn: document.getElementById('addIsbn').value,
        price: parseFloat(document.getElementById('addPrice').value),
        quantity: parseInt(document.getElementById('addQuantity').value),
        threshold: parseInt(document.getElementById('addThreshold').value)
    };

    fetch('/book', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBookData),
    })
    .then(response => {
        if (response.ok) {
            closeAddModal();
            fetchBooks(); // Refresh the book list "real-time" :)
        } else {
            console.error('Error adding new book');
        }
    })
    .catch(error => console.error('Error adding new book:', error));
}