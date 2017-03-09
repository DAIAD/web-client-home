const React = require('react');
const { FormattedMessage } = require('react-intl');
const { Link } = require('react-router');

const MainSection = require('../layout/MainSection');
const { IMAGES } = require('../../constants/HomeConstants');

const NUM = 10;
const RATE = 800;

const NotFound = React.createClass({
  render: function () {
    return (
      <MainSection id="section.login">
        <div className="form-login-container">
          { 
              <div>
                <h3>Nothing to see here</h3>
                <div className="link-reset"> 
                  <Link to="/">Move along</Link>
                </div>
              </div>
          }
        </div>
      </MainSection>        
     );
  },
});

module.exports = NotFound;

