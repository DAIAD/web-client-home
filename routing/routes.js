const React = require('react');
const { Route, IndexRoute } = require('react-router');

const HomeApp = require('../containers/HomeApp');
const Dashboard = require('../containers/DashboardData');
const History = require('../containers/HistoryData');
const Messages = require('../containers/MessageData');
const Settings = require('../containers/SettingsData');
const Profile = require('../components/sections/settings/Profile');
const Devices = require('../components/sections/settings/Devices');

const routes = () => (
  <Route path="/" component={HomeApp} >
    <IndexRoute default="dashboard" component={Dashboard} />
    <Route path="dashboard" component={Dashboard} />  
    <Route path="history" component={History} />
    <Route path="notifications" component={Messages} />
    <Route path="settings" component={Settings}>
      <IndexRoute default="profile" component={Profile} />
      <Route path="profile" component={Profile} />
      <Route path="devices" component={Devices} />
    </Route>
  </Route>
);

module.exports = routes;
