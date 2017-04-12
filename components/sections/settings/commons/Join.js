const React = require('react');
const bs = require('react-bootstrap');
const { FormattedMessage } = require('react-intl');

const Table = require('../../../helpers/Table');

const { commons: commonsSchema, allCommons: allCommonsSchema, members: membersSchema } = require('../../../../schemas/commons');

const { debounce } = require('../../../../utils/general');

const { COMMONS_SEARCH_PAGE } = require('../../../../constants/HomeConstants');

const JoinCommons = React.createClass({
  componentWillMount: function () {
    if (!this.props.synced) {
      this.props.actions.searchCommons();
    }
  },
  render: function () {
    const { allCommons, searchFilter, count, pagingIndex, commonForm, actions } = this.props;
    const { updateCommonForm, clearCommonForm, searchCommons, setSearchFilter, setSearchPagingIndex, confirmJoinCommon, setCommonsQueryAndFetch } = actions;
    return (
      <div style={{ margin: 20 }}>
        <form 
          className="search-field"
          onSubmit={(e) => { 
            e.preventDefault(); 
            setCommonsQueryAndFetch({ index: 0 }); 
          }}
        >
          <input 
            type="text"
            placeholder="Search..."
            onChange={(e) => { 
              setSearchFilter(e.target.value);
              debounce(() => { 
                setCommonsQueryAndFetch({ index: 0 });
              }, 300)();
            }}
            value={searchFilter}
          />
          <button 
            className="clear-button" 
            type="reset" 
            onClick={(e) => { 
              setCommonsQueryAndFetch({ index: 0, name: '' }); 
            }} 
          />
        </form>
        
      <Table
        className="session-list"
        rowClassName={row => 
          `
          session-list-item 
          inverted 
          ${commonForm.key === row.key ? 'selected' : ''}
          `
        }
        fields={allCommonsSchema}
        data={allCommons}
        pagination={{
          total: Math.ceil(count / COMMONS_SEARCH_PAGE),
          active: pagingIndex,
          onPageClick: (page) => { 
            setCommonsQueryAndFetch({ index: page - 1 });
          },
        }}
        onRowClick={(row) => {
          if (commonForm.key === row.key) {
            clearCommonForm();
          } else {
            updateCommonForm(row);
          }
        }}
        empty={
          <h5 style={{ marginTop: 20 }}>
            <FormattedMessage id="commonsManage.empty" />
          </h5>
          }
      />
      {
        commonForm.key && !commonForm.member ?
          <bs.Button 
            type="submit"
            style={{ marginTop: 20, float: 'right' }} 
            onClick={() => {
              //setConfirm(commonForm, 'join');
              confirmJoinCommon();
            }}
          >
            <FormattedMessage id="forms.join" />
          </bs.Button>
        :
          <div />
      }
    </div>
    );
  }
});

module.exports = JoinCommons;
