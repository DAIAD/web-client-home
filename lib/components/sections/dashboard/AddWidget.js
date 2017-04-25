'use strict';

var React = require('react');

var _require = require('react-intl'),
    FormattedMessage = _require.FormattedMessage;

var bs = require('react-bootstrap');

var _require2 = require('../../../constants/HomeConstants'),
    PNG_IMAGES = _require2.PNG_IMAGES;

function AddWidgetForm(props) {
  var widgetToAdd = props.widgetToAdd,
      widgetTypes = props.widgetTypes,
      deviceTypes = props.deviceTypes,
      setForm = props.setForm,
      activeDeviceType = props.activeDeviceType,
      setDeviceType = props.setDeviceType,
      setWidgetToAdd = props.setWidgetToAdd,
      onSubmit = props.onSubmit,
      _t = props._t;
  var title = widgetToAdd.title,
      description = widgetToAdd.description,
      id = widgetToAdd.id;

  return React.createElement(
    'div',
    null,
    React.createElement(
      bs.Tabs,
      {
        className: 'history-time-nav',
        position: 'top',
        tabWidth: 3,
        activeKey: activeDeviceType,
        onSelect: function onSelect(key) {
          return setDeviceType(key);
        }
      },
      deviceTypes.map(function (devType) {
        return React.createElement(bs.Tab, {
          key: devType.id,
          eventKey: devType.id,
          title: _t(devType.title)
        });
      })
    ),
    React.createElement(
      'div',
      { className: 'add-widget' },
      React.createElement(
        'div',
        { className: 'add-widget-left' },
        React.createElement(
          'div',
          null,
          React.createElement(
            'ul',
            { className: 'add-widget-types' },
            widgetTypes.map(function (t, idx) {
              return React.createElement(
                'li',
                {
                  key: idx,
                  className: '\n                      add-widget-type \n                      ' + t.display + ' \n                      ' + (t.id === id ? 'selected' : '') + '\n                      '
                },
                React.createElement(
                  'button',
                  {
                    className: 'btn-a',
                    onClick: function onClick() {
                      return setWidgetToAdd(t);
                    },
                    value: t.id,
                    title: t.description
                  },
                  t.image ? React.createElement(
                    'div',
                    { className: 'wrapper' },
                    React.createElement('img', {
                      src: PNG_IMAGES + '/' + t.image,
                      alt: t.id
                    }),
                    React.createElement('span', { className: 'mask' }),
                    React.createElement(
                      'h6',
                      { className: 'title' },
                      t.title
                    )
                  ) : React.createElement(
                    'div',
                    { className: 'wrapper' },
                    React.createElement('span', { className: 'mask' }),
                    React.createElement(
                      'h6',
                      { className: 'title' },
                      t.title
                    )
                  )
                )
              );
            })
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'add-widget-right' },
        React.createElement(
          'div',
          null,
          React.createElement(
            'h5',
            null,
            title
          ),
          React.createElement(
            'p',
            null,
            description
          )
        )
      )
    )
  );
}

function AddWidgetModal(props) {
  var widgetToAdd = props.widgetToAdd,
      showModal = props.showModal,
      switchMode = props.switchMode,
      addWidget = props.addWidget,
      metrics = props.metrics,
      widgetTypes = props.widgetTypes,
      deviceTypes = props.deviceTypes,
      setForm = props.setForm,
      activeDeviceType = props.activeDeviceType,
      setDeviceType = props.setDeviceType,
      setWidgetToAdd = props.setWidgetToAdd,
      resetWidgetToAdd = props.resetWidgetToAdd,
      _t = props._t;


  var onSubmit = function onSubmit(e) {
    e.preventDefault();
    addWidget(widgetToAdd);
    resetWidgetToAdd();
    switchMode('normal');
  };
  var onHide = function onHide(e) {
    e.preventDefault();
    resetWidgetToAdd();
    switchMode('normal');
  };

  return React.createElement(
    bs.Modal,
    {
      animation: false,
      className: 'add-widget-modal',
      show: showModal,
      onHide: onHide,
      bsSize: 'large',
      backdrop: 'static'
    },
    React.createElement(
      bs.Modal.Header,
      { closeButton: true },
      React.createElement(
        bs.Modal.Title,
        null,
        React.createElement(FormattedMessage, { id: 'dashboard.add' })
      )
    ),
    React.createElement(
      bs.Modal.Body,
      null,
      React.createElement(AddWidgetForm, {
        metrics: metrics,
        widgetToAdd: widgetToAdd,
        widgetTypes: widgetTypes,
        deviceTypes: deviceTypes,
        setForm: setForm,
        setDeviceType: setDeviceType,
        activeDeviceType: activeDeviceType,
        setWidgetToAdd: setWidgetToAdd,
        onSubmit: onSubmit,
        _t: _t

      })
    ),
    React.createElement(
      bs.Modal.Footer,
      null,
      React.createElement(
        'button',
        { className: 'btn-a', onClick: onHide },
        React.createElement(FormattedMessage, { id: 'forms.cancel' })
      ),
      React.createElement(
        'button',
        {
          className: 'btn-a',
          style: { marginLeft: 20 },
          onClick: onSubmit
        },
        React.createElement(FormattedMessage, { id: 'forms.add' })
      )
    )
  );
}

module.exports = AddWidgetModal;