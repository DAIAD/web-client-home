const React = require('react');
const bs = require('react-bootstrap');
const { FormattedMessage } = require('react-intl');
const Select = require('react-select');

const Table = require('../../../helpers/Table');

const { commons: commonsSchema, allCommons: allCommonsSchema, members: membersSchema } = require('../../../../schemas/commons');


const JoinCommons = React.createClass({
  componentWillMount: function () {
    this.props.clearCommon();
  },
  submit: function () {
    this.props.setConfirm(this.props.common, 'join'); 
  },
  render: function () {
    const { allCommonsFiltered, setSearchFilter, searchFilter, updateCommon, clearCommon, common } = this.props;
    return (
      <div style={{ width: '100%' }}>
        <form className="search-field">
          <input 
            type="text"
            placeholder="Search..."
            onChange={(e) => { setSearchFilter(e.target.value); }}
            value={searchFilter}
          />
          <button className="clear-button" type="reset" onClick={(e) => { setSearchFilter(''); }} />
        </form>
        
      <Table
        className="session-list"
        rowClassName={row => 
          `session-list-item inverted ${common.id === row.id ? 'selected' : ''}`
        }
        fields={allCommonsSchema}
        data={allCommonsFiltered}
        onRowClick={(row) => {
          if (common.id === row.id) {
            clearCommon();
          } else {
            updateCommon(row);
            }
        }}
      />
      {
        common.id ?
          <button 
            type="submit"
            style={{ marginTop: 20, float: 'right' }} 
            onClick={this.submit}
          >
            Join
          </button>
        :
          <div />
      }
    </div>
    );
  }
});

module.exports = JoinCommons;
