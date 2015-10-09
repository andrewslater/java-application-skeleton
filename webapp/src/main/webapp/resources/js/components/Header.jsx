var React = require("react"),
    ReactRouter = require("react-router"),
    Fluxxor = require("fluxxor");

var app = require("../app"),
    hasRole = require("../functions/hasRole");

var Link = ReactRouter.Link;
var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

module.exports = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin("UsersStore")],

    getStateFromFlux: function() {
        var store = this.getFlux().store("UsersStore");
        return {
            principal: store.getPrincipalUser()
        };
    },

    render: function () {
        principalName = this.state.principal ? this.state.principal.fullName : "";
        var adminMenu = null;
        var principal = this.state.principal;

        if (principal && hasRole(principal, 'ADMIN')) {
            adminMenu = (
                <ul className="nav navbar-nav navbar-left">
                    <li className="dropdown">
                        <a href="#" className="dropdown-toggle" data-toggle="dropdown"
                           role="button" aria-expanded="false">Admin<span
                            className="caret"></span></a>
                        <ul className="dropdown-menu" role="menu">
                            <li><Link to="/admin/settings">{$.i18n.prop('edit-settings')}</Link></li>
                            <li><Link to="/admin/users">{$.i18n.prop('list-users')}</Link></li>
                        </ul>
                    </li>
                </ul>
            );
        }
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
                       <img alt="Brand" src="/images/logo.jpg"/>
                   </a>
               </div>

               <div className="collapse navbar-collapse" id="header-content">
                   <form className="navbar-form navbar-left" role="search">
                       <div className="form-group">
                           <input type="text" className="form-control" placeholder="Search"/>
                       </div>
                   </form>
                   {adminMenu}
                   <ul className="nav navbar-nav navbar-right">
                       <li className="dropdown">
                           <a href="#" className="dropdown-toggle" data-toggle="dropdown"
                              role="button" aria-expanded="false"><span>{principalName}</span>&nbsp;
                               <span className="caret"></span></a>
                           <ul className="dropdown-menu" role="menu">
                               <li><Link to="/profile">{$.i18n.prop('profile')}</Link></li>
                               <li><Link to={'/preferences'}>{$.i18n.prop('preferences')}</Link></li>
                               <li className="divider"></li>
                               <li>
                                   <form action={'/logout'} method="post">
                                       <input type="submit" value={$.i18n.prop('logout')} className="btn btn-link"/>
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
