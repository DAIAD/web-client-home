const React = require('react');
const { Route, IndexRoute } = require('react-router');
const requireAuth = require('./auth');

const HomeApp = require('../containers/HomeApp');
const Dashboard = require('../containers/DashboardData');
const History = require('../containers/HistoryData');
const Reports = require('../containers/ReportsData');
const Commons = require('../containers/CommonsData');
const Notifications = require('../containers/NotificationData');
const Settings = require('../containers/SettingsData');
const Profile = require('../components/sections/settings/profile/');
const Devices = require('../components/sections/settings/devices/');

const MembersSettings = require('../components/sections/settings/members/');
const MembersManage = require('../components/sections/settings/members/Edit');
const MembersCreate = require('../components/sections/settings/members/Create');

const CommonsSettings = require('../components/sections/settings/commons/');
const CommonsManage = require('../components/sections/settings/commons/Edit');
const CommonsCreate = require('../components/sections/settings/commons/Create');
const CommonsJoin = require('../components/sections/settings/commons/Join');

const Login = require('../containers/Login');
const LoginForm = require('../components/sections/login/LoginForm');
const PasswordReset = require('../components/sections/login/PasswordReset');
const PasswordResetRequest = require('../components/sections/login/PasswordResetRequest');
const NotFound = require('../components/sections/404');

const routes = () => (
  <Route path="/" component={HomeApp} >
    <IndexRoute default="dashboard" component={Dashboard} onEnter={requireAuth} />
    <Route path="dashboard" component={Dashboard} onEnter={requireAuth} />  
    <Route path="history" component={History} onEnter={requireAuth} />
    <Route path="notifications" component={Notifications} onEnter={requireAuth} />
    <Route path="reports" component={Reports} onEnter={requireAuth} />
    <Route path="commons" component={Commons} onEnter={requireAuth} />
    <Route path="settings" component={Settings} onEnter={requireAuth}>
      <IndexRoute default="profile" component={Profile} />
      <Route path="profile" component={Profile} />
      <Route path="members" component={MembersSettings}>
        <IndexRoute default="edit" component={MembersManage} />
        <Route path="create" component={MembersCreate} />
      </Route>
      <Route path="devices" component={Devices} />
      <Route path="commons" component={CommonsSettings}>
        <IndexRoute default="edit" component={CommonsManage} />
        <Route path="create" component={CommonsCreate} />
        <Route path="join" component={CommonsJoin} />
      </Route>
    </Route>
    <Route path="login" component={Login}>
      <IndexRoute component={LoginForm} />
      <Route path="/password/reset/" component={PasswordResetRequest} />
      <Route path="/password/reset/:token" component={PasswordReset} />
    </Route>
    <Route path="*" component={NotFound} />
  </Route>
);

module.exports = routes;
