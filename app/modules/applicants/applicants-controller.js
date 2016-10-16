export default class ApplicantsController {
  constructor($firebaseRef, $firebaseArray) {
    this.applicants = $firebaseArray($firebaseRef.default.child('profiles'));
    return this;
  }
}

ApplicantsController.$inject = ['$firebaseRef', '$firebaseArray'];
