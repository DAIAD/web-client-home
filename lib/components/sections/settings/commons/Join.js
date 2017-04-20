'use strict';

var _react2 = require('react');

var _react3 = _interopRequireDefault(_react2);

var _babelTransform = require('livereactload/babel-transform');

var _babelTransform2 = _interopRequireDefault(_babelTransform);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _components = {
  _component: {}
};

var _livereactloadBabelTransform2 = (0, _babelTransform2.default)({
  filename: 'components/sections/settings/commons/Join.js',
  components: _components,
  locals: [],
  imports: [_react3.default]
});

function _wrapComponent(id) {
  return function (Component) {
    return _livereactloadBabelTransform2(Component, id);
  };
}

var React = require('react');
var bs = require('react-bootstrap');

var _require = require('react-intl'),
    FormattedMessage = _require.FormattedMessage;

var Table = require('../../../helpers/Table');

var _require2 = require('../../../../schemas/commons'),
    commonsSchema = _require2.commons,
    allCommonsSchema = _require2.allCommons,
    membersSchema = _require2.members;

var _require3 = require('../../../../utils/general'),
    debounce = _require3.debounce;

var _require4 = require('../../../../constants/HomeConstants'),
    COMMONS_SEARCH_PAGE = _require4.COMMONS_SEARCH_PAGE;

var JoinCommons = _wrapComponent('_component')(React.createClass({
  displayName: 'JoinCommons',

  componentWillMount: function componentWillMount() {
    if (!this.props.synced) {
      this.props.actions.searchCommons();
    }
  },
  render: function render() {
    var _props = this.props,
        allCommons = _props.allCommons,
        searchFilter = _props.searchFilter,
        count = _props.count,
        pagingIndex = _props.pagingIndex,
        commonForm = _props.commonForm,
        actions = _props.actions;
    var updateCommonForm = actions.updateCommonForm,
        clearCommonForm = actions.clearCommonForm,
        searchCommons = actions.searchCommons,
        setSearchFilter = actions.setSearchFilter,
        setSearchPagingIndex = actions.setSearchPagingIndex,
        confirmJoinCommon = actions.confirmJoinCommon,
        setCommonsQueryAndFetch = actions.setCommonsQueryAndFetch;

    return React.createElement(
      'div',
      { style: { margin: 20 } },
      React.createElement(
        'form',
        {
          className: 'search-field commons-join-search',
          onSubmit: function onSubmit(e) {
            e.preventDefault();
            setCommonsQueryAndFetch({ index: 0 });
          }
        },
        React.createElement('input', {
          type: 'text',
          placeholder: 'Search...',
          onChange: function onChange(e) {
            setSearchFilter(e.target.value);
            debounce(function () {
              setCommonsQueryAndFetch({ index: 0 });
            }, 300)();
          },
          value: searchFilter
        }),
        React.createElement('button', {
          className: 'clear-button',
          type: 'reset',
          onClick: function onClick(e) {
            setCommonsQueryAndFetch({ index: 0, name: '' });
          }
        })
      ),
      React.createElement(Table, {
        className: 'session-list',
        rowClassName: function rowClassName(row) {
          return '\n          session-list-item \n          inverted \n          ' + (commonForm.key === row.key ? 'selected' : '') + '\n          ';
        },
        fields: allCommonsSchema,
        data: allCommons,
        pagination: {
          total: Math.ceil(count / COMMONS_SEARCH_PAGE),
          active: pagingIndex,
          onPageClick: function onPageClick(page) {
            setCommonsQueryAndFetch({ index: page - 1 });
          }
        },
        onRowClick: function onRowClick(row) {
          if (commonForm.key === row.key) {
            clearCommonForm();
          } else {
            updateCommonForm(row);
          }
        },
        empty: React.createElement(
          'h5',
          { style: { marginTop: 20 } },
          React.createElement(FormattedMessage, { id: 'commonsManage.empty' })
        )
      }),
      commonForm.key && !commonForm.member ? React.createElement(
        bs.Button,
        {
          type: 'submit',
          style: { marginTop: 20, float: 'right' },
          onClick: function onClick() {
            //setConfirm(commonForm, 'join');
            confirmJoinCommon();
          }
        },
        React.createElement(FormattedMessage, { id: 'forms.join' })
      ) : React.createElement('div', null)
    );
  }
}));

module.exports = JoinCommons;