const React = require('react');
const { FormattedMessage } = require('react-intl');

const MainSection = require('../../layout/MainSection');
const { IMAGES } = require('../../../constants/HomeConstants');

const Login = React.createClass({
  render: function () {
    const { _t, intl, errors, info, children } = this.props;
    return (
      <MainSection id="section.login">
        <div className="form-login-container">
          { React.cloneElement(children, this.props) }
          <div className="login-errors">
            {
            info ?
              <span>
                <img src={`${IMAGES}/info.svg`} alt="info" />
                <FormattedMessage id={`info.${info}`} />
              </span>
              :
              <div />
          }
          {
            errors ?
              <span>
                <img src={`${IMAGES}/warning.svg`} alt="error" />
                <FormattedMessage id={`errors.${errors}`} />
              </span>
              :
              <div />
          }
          </div>
        </div>
      </MainSection>        
     );
  },
});

module.exports = Login;

