import React, { Component } from 'react';

class ShowBooksView extends Component {
    render() {
        let bookRows=this.props.books.map(book =>
            <tr key={book._id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.description}</td>
                {this.getActions(book)}
            </tr>
        );

        return (
            <div className="books-view">
                <h1>Books</h1>
                <table className="books-table">
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {bookRows}
                    </tbody>
                </table>
            </div>
        );
    }

    getActions(book) {
        if (book._acl.creator === sessionStorage.getItem('userId')) {
            return (
                <td>
                    <input type="button" value="Edit"
                           onClick={this.props.editBookClicked.bind(this, book._id)}/>
                    &nbsp;
                    <input type="button" value="Delete"
                           onClick={this.props.deleteBookClicked.bind(this, book._id)}/>
                </td>
            );
        } else {
            return <td></td>;
        }
    }
}

export default ShowBooksView;