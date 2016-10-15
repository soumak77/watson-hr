import ReportingController from './reporting-controller';

export default angular.module('application.reporting', ['firebase.database'])
  .controller('ReportingController', ReportingController)
  .name;
