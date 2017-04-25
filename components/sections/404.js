const React = require('react');
const { FormattedMessage } = require('react-intl');
const { Link } = require('react-router');

const MainSection = require('../layout/MainSection');
const { IMAGES } = require('../../constants/HomeConstants');

const NotFound = React.createClass({
  render: function () {
    return (
      <MainSection id="section.login">
        <div className="form-login-container">
          { 
            <div>
              <h1>404</h1>
              <h3><FormattedMessage id="404.title" /></h3>
              <div className="link-reset"> 
                <Link to="/"><FormattedMessage id="404.link" /></Link>
              </div>
            </div>
          }
        </div>
      </MainSection>        
     );
  },
});

module.exports = NotFound;

