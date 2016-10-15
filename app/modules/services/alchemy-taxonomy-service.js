class AlchemyTaxonomyService {
  constructor() {
  }

  static serviceImpl($resource) {
    return $resource('/alchemy/taxonomy', {});
  }
}

AlchemyTaxonomyService.serviceImpl.$inject = ['$resource'];

export default AlchemyTaxonomyService;
