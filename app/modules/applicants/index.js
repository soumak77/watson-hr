import 'firebase';
import ApplicantsController from './applicants-controller';

export default angular.module('application.applicants', ['firebase.database'])
  .controller('ApplicantsController', ApplicantsController)
  .name;
