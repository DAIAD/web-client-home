const React = require('react');
const { FormattedMessage } = require('react-intl');

const { IMAGES } = require('../../constants/HomeConstants');

function QuerySuccess() {
  return (
    <div className="query-success">
      <h4>
        <img src={`${IMAGES}/success.svg`} alt="success" />
        &nbsp;
        <FormattedMessage id="forms.saved" />
      </h4>
    </div>
  );
}

module.exports = QuerySuccess;
