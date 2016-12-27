const React = require('react');
const { Route, IndexRoute } = require('react-router');

const HomeApp = require('../containers/HomeApp');
const DashboardData = require('../containers/DashboardData');
const HistoryData = require('../containers/HistoryData');
const Commons = require('../components/sections/Commons');
const Messages = require('../containers/MessageData');
const Settings = require('../containers/SettingsData');
const Profile = require('../components/sections/Profile');
const Devices = require('../components/sections/Devices');

const routes = () => (
  <Route path="/" component={HomeApp} >
    <IndexRoute component={DashboardData} />
    <Route path="/dashboard" component={DashboardData} />  
    <Route path="/history" component={HistoryData} />
    <Route path="/commons" component={Commons} />
    <Route path="/notifications" component={Messages} />
    <Route path="/settings" component={Settings}>
      <IndexRoute component={Profile} />
      <Route path="/settings/profile" component={Profile} />
      <Route path="/settings/devices" component={Devices} />
    </Route>
  </Route>
);

module.exports = routes;
