export default class ProfileController {
  constructor($firebaseRef, $firebaseObject, $firebaseAuthService, $state, $timeout, $stateParams, $q, AlchemyTaxonomyService, AlchemyKeywordService, PersonalityInsightsService, VisualRecognitionService) {
    this.$AlchemyTaxonomyService = AlchemyTaxonomyService;
    this.$AlchemyKeywordService = AlchemyKeywordService;
    this.$PersonalityInsightsService = PersonalityInsightsService;
    this.$VisualRecognitionService = VisualRecognitionService;
    this.$q = $q;
    this.$timeout = $timeout;
    this.$firebaseRef = $firebaseRef;
    this.$firebaseObject = $firebaseObject;

    this.init($stateParams.id);
    this.editable = false;

    // require authentication to access profiles
    $firebaseAuthService.$requireSignIn()
      .then(() => {
        if (!this.id) {
          $state.go('profile', {id: $firebaseAuthService.$getAuth().uid }, { reload: true });
        } else {
          this.editable = $firebaseAuthService.$getAuth().uid === this.id;
          if (this.editable) {
            // check if user has image from social site
            if ($firebaseAuthService.$getAuth().photoURL) {
              this.imagePath = $firebaseAuthService.$getAuth().photoURL;
            }
            if ($firebaseAuthService.$getAuth().displayName) {
              this.name = $firebaseAuthService.$getAuth().displayName;
            }
          }
        }
      })
      .catch(() => $state.go('home'));

    return this;
  }

  init(id) {
    this.id = id;
    if (id) {
      this.dataRef = this.$firebaseRef.default.child('profiles').child(this.id);
      this.resumeAnalysis = this.$firebaseObject(this.dataRef.child('resume'));

      this.name = this.$firebaseObject(this.dataRef.child('name'));
      this.imagePath = this.$firebaseObject(this.dataRef.child('image'));
    }
  }

  saveResume() {
    this.resumeAnalysis.$save();
    this.analyzeResume();
  }

  analyzeResume() {
    var promises = [];

    promises.push(this.$AlchemyTaxonomyService.save({}, {
      text: this.resumeAnalysis.content
    }).$promise);

    promises.push(this.$AlchemyKeywordService.save({}, {
      text: this.resumeAnalysis.content,
      sentiment: 1,
      emotion: 1
    }).$promise);

    promises.push(this.$PersonalityInsightsService.save({}, {
      text: this.resumeAnalysis.content
    }).$promise);

    promises.push(this.$VisualRecognitionService.save({}, {
      url: this.imagePath
    }).$promise);

    return this.$q.all(promises).then((data) => {
      this.resumeAnalysis.taxonomy = data[0].taxonomy;
      this.resumeAnalysis.keywords = data[1].keywords;
      this.resumeAnalysis.personality = data[2].tree;
      this.resumeAnalysis.visual = data[3];
      this.resumeAnalysis.$save();
    });
  }

  printJson(data) {
    return JSON.stringify(data, null, 2);
  }
}

ProfileController.$inject = ['$firebaseRef', '$firebaseObject', '$firebaseAuthService', '$state', '$timeout', '$stateParams', '$q', 'AlchemyTaxonomyService', 'AlchemyKeywordService', 'PersonalityInsightsService', 'VisualRecognitionService'];
