let books = JSON.parse(localStorage.getItem("books")) || [];

const bookForm = document.getElementById("bookForm");
const searchForm = document.getElementById("searchBook");
const incompleteBookList = document.getElementById("incompleteBookList");
const completeBookList = document.getElementById("completeBookList");

function saveBooks() {
    localStorage.setItem("books", JSON.stringify(books));
}

function createBookElement(book) {
    const bookItem = document.createElement("div");
    bookItem.setAttribute("data-bookid", book.id);
    bookItem.setAttribute("data-testid", "bookItem");

    bookItem.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton" onclick="toggleBook(${book.id})">
          ${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}
        </button>
        <button data-testid="bookItemDeleteButton" onclick="deleteBook(${book.id})">Hapus Buku</button>
        <button data-testid="bookItemEditButton" onclick="editBook(${book.id})">Edit Buku</button>
      </div>
    `;
    return bookItem;
}

function renderBooks(filter = "") {
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    books
        .filter(book => book.title.toLowerCase().includes(filter.toLowerCase()))
        .forEach(book => {
            const bookElement = createBookElement(book);
            book.isComplete ? completeBookList.appendChild(bookElement) : incompleteBookList.appendChild(bookElement);
        });
}

// tambahh buku baru
function addBook(event) {
    event.preventDefault();
    const title = document.getElementById("bookFormTitle").value.trim();
    const author = document.getElementById("bookFormAuthor").value.trim();
    const year = parseInt(document.getElementById("bookFormYear").value);
    const isComplete = document.getElementById("bookFormIsComplete").checked;

    if (!title || !author || isNaN(year)) {
        alert("Semua input harus diisi dengan benar!");
        return;
    }

    const newBook = { id: Date.now(), title, author, year, isComplete };
    books.push(newBook);
    saveBooks();
    renderBooks();
    bookForm.reset();
}

// hapusss buku
function deleteBook(id) {
    books = books.filter(book => book.id !== id);
    saveBooks();
    renderBooks();
}

// pindah buku rak
function toggleBook(id) {
    const book = books.find(book => book.id === id);
    if (book) {
        book.isComplete = !book.isComplete;
        saveBooks();
        renderBooks();
    }
}

// menampilkan  edit buku
function showEditModal(book) {
    document.getElementById("editBookId").value = book.id;
    document.getElementById("editBookTitle").value = book.title;
    document.getElementById("editBookAuthor").value = book.author;
    document.getElementById("editBookYear").value = book.year;
    
    document.getElementById("editBookModal").style.display = "flex";
}

// 
function closeEditModal() {
    document.getElementById("editBookModal").style.display = "none";
}


function editBook(id) {
    const book = books.find(book => book.id === id);
    if (book) {
        showEditModal(book);
    }
}


document.getElementById("editBookForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const bookId = parseInt(document.getElementById("editBookId").value);
    const newTitle = document.getElementById("editBookTitle").value.trim();
    const newAuthor = document.getElementById("editBookAuthor").value.trim();
    const newYear = parseInt(document.getElementById("editBookYear").value);

    if (!newTitle || !newAuthor || isNaN(newYear)) {
        alert("Semua input harus diisi!");
        return;
    }

    const book = books.find(book => book.id === bookId);
    if (book) {
        book.title = newTitle;
        book.author = newAuthor;
        book.year = newYear;
        saveBooks();
        renderBooks();
        closeEditModal();
    }
});


bookForm.addEventListener("submit", addBook);

searchForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const searchTitle = document.getElementById("searchBookTitle").value;
    renderBooks(searchTitle);
});

document.addEventListener("DOMContentLoaded", () => renderBooks());


