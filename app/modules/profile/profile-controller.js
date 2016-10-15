export default class ProfileController {
  constructor($firebaseRef, $firebaseObject, $timeout, $stateParams, $q, TaxonomyService, PersonalityInsightsService) {
    this.id = $stateParams.id;
    this.dataRef = $firebaseRef.default.child('profiles').child(this.id);
    this.resume = `
Dear Director Cyrus,

I write in response to your ad seeking an Bookkeeper at Michael’s Furniture. As a highly competent Bookkeeper, I would bring a detail-focused, ethical, and problem solving mindset to this role.
In my current position, I maintain an exceedingly functional and professional environment while handling bookkeeping for the New Cityland School District. I have a knack for problem solving and work well independently and with little oversight. I respond to requests from colleagues and staff in a timely manner and am adept at prioritizing multiple ongoing projects.
Additionally, I am an expert in:
Maintaining diverse financial documentation in an organized fashion both on paper and electronically for easy reference.
Processing reconciliations and documents quickly to ensure system remains up to date.
Completing payroll accurately and on time.
Increasing efficiency and improving workflow through creative process improvements.

I am a self-starter and excel at account reconciliations, cost control, and payroll. I am also deeply familiar with Excel and QuickBooks and adapt quickly to new programs and procedures. As a part of the team at Michael’s Furniture, I hope to provide unparalleled accuracy and help you expand your business goals.
My resume and references are attached. Please feel free to contact me at your earliest convenience to discuss the position and your needs in detail.
Thank you for your time and consideration.

Sincerely,
Isabella Davis`
    ;
    this.resumeAnalysis = $firebaseObject(this.dataRef.child('resume'));
    this.$TaxonomyService = TaxonomyService;
    this.$PersonalityInsightsService = PersonalityInsightsService;
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

    promises.push(this.$PersonalityInsightsService.save({}, {
      text: this.resume
    }).$promise.then((results) => {
      this.resumeAnalysis.personality = results.tree;
    }));

    return this.$q.all(promises).then(() => {
      this.resumeAnalysis.$save();
    });
  }

  printJson(data) {
    return JSON.stringify(data, null, 2);
  }
}

ProfileController.$inject = ['$firebaseRef', '$firebaseObject', '$timeout', '$stateParams', '$q', 'TaxonomyService', 'PersonalityInsightsService'];
