const React = require('react');
const bs = require('react-bootstrap');
const { FormattedMessage } = require('react-intl');

const CommonFormFields = require('./Form');

const CreateCommons = React.createClass({
  componentWillMount: function () {
    this.props.actions.clearCommonForm();
  },
  render: function () {
    const { commonForm, actions } = this.props;
    const { confirmCreate, updateCommonForm } = actions;
    return (
      <form 
        id="form-common-create"
        style={{ width: '50%' }}
        onSubmit={(e) => { 
          e.preventDefault();
          confirmCreate();
        }}
      >
        <CommonFormFields
          values={commonForm}
          onChange={updateCommonForm}
          disabled={false}
        />

        <button 
          type="submit"
          style={{ float: 'right' }} 
        >
          Create
        </button>
      </form>
    );
  },
});

module.exports = CreateCommons;
