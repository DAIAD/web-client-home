const React = require('react');
const classNames = require('classnames');

const Logout = React.createClass({
  onLogout: function (e) {
    e.preventDefault();
    this.props.logout();
  },
  render: function () {
    const _t = this.props.intl.formatMessage;
    if (!this.props.isAuthenticated) {
      return (<div />);
    }
    return (
      <a 
        id="logout"
        className="logout"
        title={_t({ id: 'loginForm.button.signout' })}
        onClick={this.onLogout}
        type="submit"
      >
        <i className={classNames('fa', 'fa-md', 'fa-sign-out', 'navy')} />
      </a>
    );
  } 
});

module.exports = Logout;
