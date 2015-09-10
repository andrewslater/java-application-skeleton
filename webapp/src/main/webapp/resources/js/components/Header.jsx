var React = require("react");
var Router = require("router");
var app = require("../app");

var Link = Router.Link;
var contextPath = "/skeleton";

module.exports = React.createClass({
   render: function () {
       return (<nav className="navbar navbar-default">
           <div className="container-fluid">
               <div className="navbar-header">
                   <button type="button" className="navbar-toggle collapsed"
                           data-toggle="collapse" data-target="#header-content">
                       <span className="sr-only">Toggle navigation</span>
                       <span className="icon-bar"></span>
                       <span className="icon-bar"></span>
                       <span className="icon-bar"></span>
                   </button>
                   <a className="navbar-brand" href="#">
                       <img alt="Brand" src="/skeleton/images/logo.jpg"/>
                   </a>
               </div>

               <div className="collapse navbar-collapse" id="header-content">
                   <form className="navbar-form navbar-left" role="search">
                       <div className="form-group">
                           <input type="text" className="form-control" placeholder="Search"/>
                       </div>
                       <span className="glyphicon glyphicon-search" aria-hidden="true"></span>
                   </form>
                   <ul className="nav navbar-nav navbar-left">
                       <li className="dropdown">
                           <a href="#" className="dropdown-toggle" data-toggle="dropdown"
                              role="button" aria-expanded="false">Admin<span
                               className="caret"></span></a>
                           <ul className="dropdown-menu" role="menu">
                               <li><Link to="admin-edit-settings">{$.i18n.prop('edit-settings')}</Link></li>
                               <li><Link to="admin-list-users">{$.i18n.prop('list-users')}</Link></li>
                               <li><a href={contextPath + '/admin/users/create'}>Create User</a></li>
                           </ul>
                       </li>
                   </ul>
                   <ul className="nav navbar-nav navbar-right">
                       <li className="dropdown">
                           <a href="#" className="dropdown-toggle" data-toggle="dropdown"
                              role="button" aria-expanded="false"><span>John Doe</span>&nbsp;
                               <span className="caret"></span></a>
                           <ul className="dropdown-menu" role="menu">
                               <li><a href={contextPath + 'settings/account'}>Settings</a></li>
                               <li><a href="#">Preferences</a></li>
                               <li className="divider"></li>
                               <li>
                                   <form action={contextPath + '/logout'} method="post">
                                       <input type="submit" value="Logout" className="btn btn-link"/>
                                       <input type="hidden" name="_csrf" value={app.csrf} />
                                   </form>
                               </li>
                           </ul>
                       </li>
                   </ul>
               </div>
           </div>
       </nav>)
   }

});
