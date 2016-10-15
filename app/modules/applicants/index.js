import 'firebase';
import ApplicantController from './applicant-controller';

export default angular.module('application.applicant', ['firebase.database'])
  .controller('ApplicantController', ApplicantController)
  .name;
