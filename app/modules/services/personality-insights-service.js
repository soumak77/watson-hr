class PersonalityInsightsService {
  constructor() {
  }

  static serviceImpl($resource) {
    return $resource('/personality', {});
  }
}

PersonalityInsightsService.serviceImpl.$inject = ['$resource'];

export default PersonalityInsightsService;
