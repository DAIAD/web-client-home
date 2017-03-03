const React = require('react');
const { Route, IndexRoute } = require('react-router');
const requireAuth = require('./auth');

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
const CommonsCreate = require('../components/sections/settings/commons/Create');
const CommonsJoin = require('../components/sections/settings/commons/Join');

const Login = require('../containers/Login');
const LoginForm = require('../components/sections/login/LoginForm');
const PasswordReset = require('../components/sections/login/PasswordReset');
const PasswordResetRequest = require('../components/sections/login/PasswordResetRequest');

const routes = () => (
  <Route path="/" component={HomeApp} >
    <IndexRoute default="dashboard" component={Dashboard} onEnter={requireAuth} />
    <Route path="dashboard" component={Dashboard} onEnter={requireAuth} />  
    <Route path="history" component={History} onEnter={requireAuth} />
    <Route path="notifications" component={Messages} onEnter={requireAuth} />
    <Route path="commons" component={Commons} onEnter={requireAuth} />
    <Route path="settings" component={Settings} onEnter={requireAuth}>
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
    <Route path="login" component={Login}>
      <IndexRoute component={LoginForm} />
      <Route path="/password/reset/" component={PasswordResetRequest} />
      <Route path="/password/reset/:token" component={PasswordReset} />
    </Route>
  </Route>
);

module.exports = routes;
