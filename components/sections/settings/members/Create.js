const React = require('react');
const { FormattedMessage } = require('react-intl');
const bs = require('react-bootstrap');
const MemberFormFields = require('./FormFields');

const AddMember = React.createClass({
  componentWillMount: function () {
    this.props.actions.clearMemberForm();
  },
  submit: function (e) { 
    e.preventDefault();
    this.props.actions.confirmAddMember(this.props.memberForm);
  },
  render: function () {  
    const { _t, errors, memberForm, actions } = this.props;
    const { addMember, updateMemberForm, fetchProfile, setError, dismissError, switchModeMember } = actions;
    return (
      <form 
        id="form-add-member" 
        onSubmit={this.submit}
        style={{ width: '50%', minWidth: 200 }}
      >
        <MemberFormFields
          _t={_t}
          errors={errors}
          member={memberForm}  
          updateMemberForm={updateMemberForm}
          setError={setError}
          dismissError={dismissError}
        />

        <bs.Button 
          type="submit" 
          onClick={this.submit}
          style={{ float: 'right' }} 
        >
          <FormattedMessage id="forms.create" />
        </bs.Button>
      </form>
    );
  },
});

module.exports = AddMember;
