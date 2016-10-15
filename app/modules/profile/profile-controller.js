export default class ProfileController {
  constructor($firebaseRef, $firebaseObject, $firebaseArray, $timeout, $stateParams, $q, TaxonomyService) {
    this.id = $stateParams.id;
    this.dataRef = $firebaseRef.default.child('profiles').child(this.id);
    this.resume = "Hi I'm the shit! Hire me! I know all about finances and shit!  Like bills, I got that!  Taxes, nah fuck the government.";
    this.resumeAnalysis = $firebaseObject(this.dataRef.child('resume'));
    this.$TaxonomyService = TaxonomyService;
    this.$q = $q;
    this.$timeout = $timeout;
    return this;
  }

  analyzeResume() {
    var promises = [];
    promises.push(this.$TaxonomyService.save({}, {
      text: this.resume
    }).$promise.then((results) => {
      this.resumeAnalysis.taxonomy = results.taxonomy;
    }));

    return this.$q.all(promises).then(() => {
      this.resumeAnalysis.$save();
    });
  }
}

ProfileController.$inject = ['$firebaseRef', '$firebaseObject', '$firebaseArray', '$timeout', '$stateParams', '$q', 'TaxonomyService'];
