import React from "react";
import * as BooksAPI from "./BooksAPI";
import { Link } from "react-router-dom";

class BookSearch extends React.Component {
  state = {
    bookData: [],
    // add shelf data to state whenever search is executed, just use state property for select element value, react should manage updates!?
  };

  findBookShelf(booksArray) {
    BooksAPI.getAll().then((books) => {
      // make a copy to allow easy updating of inidividual data elements
      // ref - https://stackoverflow.com/questions/43638938/updating-an-object-with-setstate-in-react
      let bookDataCopy = this.state.bookData;
      for (let i = 0; i < books.length; i++) {
        for (let j = 0; j < booksArray.length; j++) {
          if (books[i].id === booksArray[j].id) {
            let correctShelf = books[i].shelf;
            bookDataCopy[j].shelf = correctShelf;
          }
        }
      }
      this.setState({ bookData: bookDataCopy });
    });
  }

  changeOption(book, event) {
    let bookDataCopy = this.state.bookData;

    let newShelf = event.target.value;

    BooksAPI.update(book, newShelf).then((response) => {
      console.log(response);
    });

    for (let i = 0; i < bookDataCopy.length; i++) {
      if (bookDataCopy[i].id === book.id) {
        bookDataCopy[i].shelf = newShelf;
      }
    }
    this.setState({ bookData: bookDataCopy });
  }

  updateBookState(booksArray) {
    this.setState({ bookData: booksArray });
    this.findBookShelf(booksArray);
  }

  getSearchResults(searchTerm) {
    // prevent blank search term being used
    // ideally could use regex to substitute spaces e.g. spaces in between terms
    let trimmedTerm = searchTerm.trim();
    if (trimmedTerm) {
      BooksAPI.search(trimmedTerm).then((books) => {
        this.updateBookState(books);
      });
    } else {
      // if search term deleted by user, set state to blank array so search results disappear
      this.updateBookState([]);
    }
  }
  render() {
    let booksArray = this.state.bookData;
    // short circuit eval below to only execute map function when books array data actually exists
    return (
      <div className="app">
        <div className="search-books">
          <div className="search-books-bar">
            {/* <a className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</a> */}
            <Link to="/" className="close-search">
              Close
            </Link>
            <div className="search-books-input-wrapper">
              {/*
                NOTES: The search from BooksAPI is limited to a particular set of search terms.
                You can find these search terms here:
                https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                you don't find a specific author or title. Every search is limited by search terms.
              */}
              <input
                type="text"
                placeholder="Search by title or author"
                onChange={(event) => this.getSearchResults(event.target.value)}
              />
            </div>
          </div>
          <div className="search-books-results">
            <ol className="books-grid">
              {booksArray[0] &&
                booksArray.map((book) => (
                  <li key={book.id}>
                    <div className="book">
                      <div className="book-top">
                        {book.imageLinks && (
                          // a blank box will display if no imageLink info is present
                          <div
                            className="book-cover"
                            style={{
                              width: 128,
                              height: 193,
                              backgroundImage: `url(${book.imageLinks.thumbnail})`,
                            }}
                          ></div>
                        )}

                        <div className="book-shelf-changer">
                          <select
                            value={book.shelf || "none"}
                            onChange={(event) => this.changeOption(book, event)}
                          >
                            <option value="move" disabled>
                              Göndər...
                            </option>
                            <option value="currentlyReading">
                              Artıq Oxumuşam
                            </option>
                            <option value="wantToRead">Oxumaq İstəyirəm</option>
                            <option value="read">Oxuyuram</option>
                            <option value="none">Sil</option>
                          </select>
                        </div>
                      </div>
                      <div className="book-title">{book.title}</div>
                      <div className="book-authors">{book.authors}</div>
                    </div>
                  </li>
                ))}
            </ol>
          </div>
        </div>
      </div>
    );
  }
}

export default BookSearch;
