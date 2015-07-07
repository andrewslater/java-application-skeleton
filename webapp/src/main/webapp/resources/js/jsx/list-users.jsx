var UsersList = React.createClass({

    getInitialState: function () {
        return {data: this.props.data};
    },

    render: function () {
        return (
            <div>
                <table className="table table-hover">
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Created At</th>
                        <th>Last Login</th>
                        <th>Actions</th>
                    </tr>
                    {this.props.page.content.map(function(user) {
                        return <tr key={getLink(user, 'self')}>
                            <td>
                                <a>{user.fullName}</a>
                            </td>
                            <td>
                                <a>{user.email}</a>
                            </td>
                            <td>2015-01-01 12:00:00</td>
                            <td>2015-04-01 14:00:00</td>
                            <td>
                                <a>Edit</a>
                            </td>
                        </tr>;
                    })}
                </table>
                <nav>
                    <ul className="pagination">
                        <li>
                            <a href="#" aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>
                        <li><a href="#">1</a></li>
                        <li><a href="#">2</a></li>
                        <li><a href="#">3</a></li>
                        <li><a href="#">4</a></li>
                        <li><a href="#">5</a></li>
                        <li>
                            <a href="#" aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    }
});


var renderListUsers = function (usersPage) {
    React.render(
        <UsersList page={usersPage} />, document.getElementById('users-list')
    )
};

var renderListUsersServer = function (usersJson) {
    return React.renderToString(
        <UsersList page={JSON.parse(usersJson)}/>
    )
};

