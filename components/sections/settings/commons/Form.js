const React = require('react');
const bs = require('react-bootstrap');
const { FormattedMessage } = require('react-intl');
const Select = require('react-select');

const CommonForm = React.createClass({
  componentWillMount: function () {
    if (!this.props.edit) {
      this.props.clearCommon();
    }
  },
  submit: function (e) {
    e.preventDefault();
    // TODO: Proper Validation
    if (this.props.common.name === '') {
      alert('no name');
    } else if (this.props.edit) {
      this.props.setConfirm(this.props.common, 'edit'); 
      //this.props.editCommon(this.state.common);
      //this.props.close();
    } else {
      this.props.setConfirm({ 
        ...this.props.common, 
        id: Math.max(...this.props.allCommons.map(c => c.id)) + 1, 
        createdOn: new Date().valueOf(), 
        owners: [],
        members: [],
        joined: true,
        owned: true,
      }, 'create'); 
    }
  },
  render: function () {
    const { close, allCommons, edit, owned, allMembers = [], deleteCommon, updateCommon, common } = this.props;

    if (!common) {
      return <div />;
    }
    return (
      <div style={{ width: 400 }}>
      <form 
        id="form-create-modal"
        onSubmit={this.submit}
        style={{ textAlign: 'left' }} 
      >
        
        <bs.Input 
          type="text"
          placeholder="Common name..."
          label="Name"
          disabled={edit && !owned}
          onChange={(e) => { 
            updateCommon({ ...common, name: e.target.value });
          }}
          value={common.name}
        />
        
        <bs.Input 
          type="textarea"
          placeholder="Common description..."
          label="Description"
          disabled={edit && !owned}
          onChange={(e) => { 
            updateCommon({ ...common, description: e.target.value });
          }}
          value={common.description}
        />
      { edit ?
        <div>
          <label htmlFor="select-owners">Owners</label>
          <Select
            id="select-owners"
            name="select-owners"
            disabled={edit && !owned}
            multi
            value={common.owners.map(m => m.id)}
            options={common.members.map(m => ({ value: m.id, label: m.name }))}
            onChange={(val) => { 
              console.log('changed:', val); 
              updateCommon({ ...common, owners: common.members.filter(m => val.map(v => v.value).includes(m.id)), });
            }}
          />
        </div>
        : <div /> 
      }
      </form>
      <br />
      { !edit || owned ? 
        <button style={{ float: 'right' }} onClick={this.submit}>{ edit ? 'Update' : 'Create' }</button>
        :
          <div />
       }
      { 
        edit && owned ?
          <button
            onClick={() => { this.props.setConfirm(this.props.common, 'delete'); }}
            style={{ float: 'right', marginRight: 20 }}
          >
            Delete common
          </button>
        :
          <span />
     }
     { 
        edit ?
          <button
            onClick={() => { this.props.setConfirm(this.props.common, 'leave'); }}
            style={{ float: 'right', marginRight: 20 }}
          >
            Leave common
          </button>
        :
          <span />
     }
      </div>
    );
  }
});

module.exports = CommonForm;
