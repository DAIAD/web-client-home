const React = require('react');
const bs = require('react-bootstrap');
const { FormattedMessage } = require('react-intl');

const CommonFormFields = require('./Form');

const CreateCommons = React.createClass({
  componentWillMount: function () {
    this.props.actions.clearCommonForm();
  },
  render: function () {
    const { _t, commonForm, actions } = this.props;
    const { confirmCreateCommon, updateCommonForm } = actions;
    return (
      <form 
        id="form-common-create"
        onSubmit={(e) => { 
          e.preventDefault();
          confirmCreateCommon();
        }}
      >
        <CommonFormFields
          _t={_t}
          values={commonForm}
          onChange={updateCommonForm}
          disabled={false}
        />

        <button 
          className="btn"
          type="submit"
          style={{ float: 'right' }} 
        >
          <FormattedMessage id="forms.create" />
        </button>
      </form>
    );
  },
});

module.exports = CreateCommons;
