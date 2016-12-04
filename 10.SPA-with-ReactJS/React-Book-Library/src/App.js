import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';

import NavigationBar from './Components/NavigationBar';
import Footer from './Components/Footer';

import HomeView from './Views/HomeView';
import LoginView from './Views/LoginView';
import RegisterView from './Views/RegisterView';
import ShowBooksView from './Views/ShowBooksView';
import CreateBookView from './Views/CreateBookView';
import EditBookView from './Views/EditBookView';
import DeleteBookView from './Views/DeleteBookView';

import $ from 'jquery';
import KinveyRequester from './KinveyRequester';

class App extends Component {
  constructor(props) {
      super(props);
      this.state = {
          username: null,
          userId: null
      }
  }

  componentDidMount() {
      // Attach global AJAX "loading" event handlers
      $(document).on({
          ajaxStart: function() { $("#loadingBox").show() },
          ajaxStop: function() { $("#loadingBox").hide() }
      });

      // Attach a global AJAX error handler
      $(document).ajaxError(this.handleAjaxError.bind(this));

      // Load user info state
      this.setState({
          username: sessionStorage.getItem("username"),
          userId: sessionStorage.getItem("userId")
      });

      // Hide the info / error boxes when clicked
      $("#infoBox, #errorBox").click(function() {
          $(this).fadeOut();
      });

      // Initially load the "Home" view when the app starts
      this.showHomeView();
  }

    handleAjaxError(event, response) {
        let errorMsg = JSON.stringify(response);
        if (response.readyState === 0)
            errorMsg = "Cannot connect due to network error.";
        if (response.responseJSON && response.responseJSON.description)
            errorMsg = response.responseJSON.description;
        this.showError(errorMsg);
    }

    showInfo(message) {
        $('#infoBox').text(message).show();
        setTimeout(function() {
            $('#infoBox').fadeOut();
        }, 3000);
    }

    showError(errorMsg) {
        $('#errorBox').text("Error: " + errorMsg).show();
    }


    render() {
    return (
      <div className="App">
        <header>
            <NavigationBar
                username={this.state.username} //binding username
                homeClicked={this.showHomeView.bind(this)}
                loginClicked={this.showLoginView.bind(this)}
                registerClicked={this.showRegisterView.bind(this)}
                booksClicked={this.showBooksView.bind(this)}
                createBookClicked={this.showCreateBookView.bind(this)}
                logoutClicked={this.logout.bind(this)}

            />
            <div id="loadingBox">Loading ...</div>
            <div id="infoBox">Info message</div>
            <div id="errorBox">Error message</div>
        </header>
          <div id="main"></div>
          <Footer />
      </div>
    );
  }

  showView(reactComponent) {
      ReactDOM.render(
          reactComponent,
          document.getElementById('main')
      );
  }

  showHomeView() {
      this.showView(<HomeView username={this.state.username} />); // set the username at every change
      $('#errorBox').hide();
  }

  showLoginView() {
      this.showView(<LoginView onsubmit={this.login.bind(this)}/>);
  }

  login(username, password) {
        KinveyRequester.loginUser(username, password)
            .then(loginSuccess.bind(this));

        function loginSuccess(data) {
            this.saveAuthInSession(data);
            this.showInfo('Login successful.');
            this.showBooksView();
        }
  }

  showRegisterView() {
        this.showView(<RegisterView onsubmit={this.register.bind(this)} />);
    }

  register(username, password) {
        KinveyRequester.registerUser(username, password)
            .then(registerSuccess.bind(this));

        function registerSuccess(userInfo) {
            this.saveAuthInSession(userInfo);
            this.showBooksView();
            this.showInfo("User registration successful.");
        }
    }

  saveAuthInSession(userInfo) {
        sessionStorage.setItem('authToken', userInfo._kmd.authtoken);
        sessionStorage.setItem('userId', userInfo._id);
        sessionStorage.setItem('username', userInfo.username);

        // This will update the entire app UI (e.g. the navigation bar)
        this.setState({
            username: userInfo.username,
            userId: userInfo._id
        });
    }

  showBooksView() {
      KinveyRequester.loadBooks()
          .then(loadBooksSuccess.bind(this));

      function loadBooksSuccess(books) {
          this.showInfo("Books loaded.");
          this.showView(<ShowBooksView
              books={books}
              editBookClicked={this.showEditBookView.bind(this)}
              deleteBookClicked={this.showDeleteBookView.bind(this)}
          />);
      }
  }

  showCreateBookView() {
    this.showView(<CreateBookView onsubmit={this.createBook.bind(this)}/>)
  }

  createBook(title, author, description) {
       KinveyRequester.createBook(title, author, description)
           .then(createBookSuccess.bind(this));
       
       function createBookSuccess() {
            this.showInfo("Book created.");
            this.showBooksView();
       }
  }

  showDeleteBookView(bookId) {
      KinveyRequester.findBookById(bookId)
          .then(bookFoundSuccess.bind(this));

      function bookFoundSuccess(book) {
          let deleteBookView=<DeleteBookView
              bookId={book._id}
              title={book.title}
              author={book.author}
              description={book.description}
              onsubmit={this.deleteBook.bind(this)}
          />;
          this.showView(deleteBookView);
      }
  }

    deleteBook(bookId) {
      KinveyRequester.deleteBook(bookId)
          .then(deleteBookSuccess.bind(this));

      function deleteBookSuccess() {
          this.showInfo("Book deleted!");
          this.showBooksView();
      }
    }

    showEditBookView(bookId) {
      KinveyRequester.findBookById(bookId)
          .then(bookFoundSuccess.bind(this));

      function bookFoundSuccess(book) {
          let editBookView=<EditBookView
              bookId={book._id}
              title={book.title}
              author={book.author}
              description={book.description}
              onsubmit={this.editBook.bind(this)}
          />;
          this.showView(editBookView);
      }
  }

    editBook(bookId, title, author, description) {
        KinveyRequester.editBook(bookId, title, author, description)
            .then(editBookSuccess.bind(this));

        function editBookSuccess() {
            this.showBooksView();
            this.showInfo("Book created.");
        }
    }

  logout() {
      sessionStorage.clear();
      this.setState({
          username: null,
          password: null
      });

      this.showView(<HomeView />);
  }
}


export default App;