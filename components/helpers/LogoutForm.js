const React = require('react');
const classNames = require('classnames');

const Logout = React.createClass({
  onLogout: function (e) {
    e.preventDefault();
    this.props.logout();
  },
  render: function () {
    const { _t } = this.props;
    if (!this.props.isAuthenticated) {
      return (<div />);
    }
    return (
      <button
        id="logout"
        className="btn-a logout"
        title={_t('loginForm.button.signout')}
        onClick={this.onLogout}
        type="submit"
      >
        <i className={classNames('fa', 'fa-md', 'fa-sign-out', 'navy')} />
      </button>
    );
  } 
});

module.exports = Logout;
