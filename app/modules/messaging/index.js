import 'firebase';
import MessagingController from './messaging-controller';

export default angular.module('application.messaging', ['firebase.database'])
  .controller('MessagingController', MessagingController)
  .name;
