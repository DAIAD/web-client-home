const React = require('react');
const { Route, IndexRoute } = require('react-router');

const HomeApp = require('../containers/HomeApp');
const Dashboard = require('../containers/DashboardData');
const History = require('../containers/HistoryData');
const Commons = require('../containers/CommonsData');
const Messages = require('../containers/MessageData');
const Settings = require('../containers/SettingsData');
const Profile = require('../components/sections/settings/Profile');
const Devices = require('../components/sections/settings/Devices');
const CommonsSettings = require('../components/sections/settings/commons/');
const CommonsManage = require('../components/sections/settings/commons/Edit');
const CommonsCreate = require('../components/sections/settings/commons/Form');
const CommonsJoin = require('../components/sections/settings/commons/Join');

const routes = () => (
  <Route path="/" component={HomeApp} >
    <IndexRoute default="dashboard" component={Dashboard} />
    <Route path="dashboard" component={Dashboard} />  
    <Route path="history" component={History} />
    <Route path="notifications" component={Messages} />
    <Route path="commons" component={Commons} />
    <Route path="settings" component={Settings}>
      <IndexRoute default="profile" component={Profile} />
      <Route path="profile" component={Profile} />
      <Route path="devices" component={Devices} />
      <Route path="commons" component={CommonsSettings}>
        <IndexRoute default="edit" component={CommonsManage} />
        <Route path="edit" component={CommonsManage} />
        <Route path="create" component={CommonsCreate} />
        <Route path="join" component={CommonsJoin} />
      </Route>
    </Route>
  </Route>
);

module.exports = routes;
