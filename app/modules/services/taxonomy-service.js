class TaxonomyService {
  constructor() {
  }

  static serviceImpl($resource) {
    return $resource('/api/taxonomy', {});
  }
}

TaxonomyService.serviceImpl.$inject = ['$resource'];

export default TaxonomyService;
