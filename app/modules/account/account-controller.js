export default class AccountController {
  constructor($firebaseAuthService, $firebaseRef, $log, $state, $stateParams, BaseAppsApi) {
    this.type = $stateParams.type || 'applicant';
    this.authService = $firebaseAuthService;
    this.authLoading = false;
    this.$log = $log;
    this.$state = $state;
    this.BaseAppsApi = BaseAppsApi;
    this.$firebaseRef = $firebaseRef;
    return this;
  }

  signin(provider) {
    const $log = this.$log;
    const BaseAppsApi = this.BaseAppsApi;

    switch (provider) {
      case 'anonymous':
        this.authLoading = true;
        return this.authService.$signInAnonymously()
          .then(() => {
            this.$firebaseRef.default.child('profiles').child(this.authService.$getAuth().uid).child('type').set(this.type);
            this.$firebaseRef.default.child('profiles').child(this.authService.$getAuth().uid).child('image').set('images/silhouette.png');
            this.$firebaseRef.default.child('profiles').child(this.authService.$getAuth().uid).child('name').set('Anonymous');
            if (this.type === 'applicant') {
              this.$state.go('profile', {id: this.authService.$getAuth().uid});
            } else {
              this.$state.go('applicants');
            }
          })
          .catch((error) => {
            $log.log('Login Failed!', error);
            BaseAppsApi.publish('account-notifications', {
              title: 'Anonymous Login Failed',
              content: error.message,
              color: 'alert'
            });
          })
          .finally(() => {
            this.authLoading = false;
          });
      case 'google':
      case 'twitter':
      case 'facebook':
      case 'github':
        this.authLoading = true;
        return this.authService.$signInWithPopup(provider)
          .then(() => {
            var name = 'Anonymous';
            var image = 'images/silhouette.png';
            // check if user has image from social site
            if ($firebaseAuthService.$getAuth().photoURL) {
              image = $firebaseAuthService.$getAuth().photoURL;
            }
            if ($firebaseAuthService.$getAuth().displayName) {
              name = $firebaseAuthService.$getAuth().displayName;
            }

            this.$firebaseRef.default.child('profiles').child(this.authService.$getAuth().uid).child('type').once('value').then((val) => {
              if (!val) {
                this.$firebaseRef.default.child('profiles').child(this.authService.$getAuth().uid).child('type').set(this.type);
                this.$firebaseRef.default.child('profiles').child(this.authService.$getAuth().uid).child('image').set(image);
                this.$firebaseRef.default.child('profiles').child(this.authService.$getAuth().uid).child('name').set(name);
              }

              if (this.type === 'applicant') {
                this.$state.go('profile', {id: this.authService.$getAuth().uid});
              } else {
                this.$state.go('applicants');
              }
            });
          })
          .catch((error) => {
            $log.log('Login Failed!', error);
            BaseAppsApi.publish('account-notifications', {
              title: provider.substr(0, 1).toUpperCase() + provider.substr(1) + ' Login Failed',
              content: error.message + (error.email ? ' (email: ' + error.email + ')' : ''),
              color: 'alert'
            });
          })
          .finally(() => {
            this.authLoading = false;
          });
      default:
        $log.log('Provider not supported: ' + provider);
        return null;
    }
  }

  printUserInfo() {
    return JSON.stringify(this.authService.$getAuth(), null, 2);
  }

  signout() {
    this.authLoading = true;
    return this.authService.$signOut()
      .finally(() => {
        this.authLoading = false;
      });
  }
}

AccountController.$inject = ['$firebaseAuthService', '$firebaseRef', '$log', '$state', '$stateParams', 'BaseAppsApi'];
