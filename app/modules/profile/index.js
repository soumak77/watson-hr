import 'firebase';
import ProfileController from './profile-controller';

export default angular.module('application.profile', ['firebase.database', 'application.services'])
  .controller('ProfileController', ProfileController)
  .name;
