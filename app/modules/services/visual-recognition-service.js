class VisualRecognitionService {
  constructor() {
  }

  static serviceImpl($resource) {
    return $resource('/visual/classify', {});
  }
}

VisualRecognitionService.serviceImpl.$inject = ['$resource'];

export default VisualRecognitionService;
