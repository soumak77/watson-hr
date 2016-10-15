class AlchemyKeywordService {
  constructor() {
  }

  static serviceImpl($resource) {
    return $resource('/alchemy/keywords', {});
  }
}

AlchemyKeywordService.serviceImpl.$inject = ['$resource'];

export default AlchemyKeywordService;
