import 'firebase';
import AlchemyTaxonomyService from './alchemy-taxonomy-service';
import AlchemyKeywordService from './alchemy-keyword-service';
import PersonalityInsightsService from './personality-insights-service';
import VisualRecognitionService from './visual-recognition-service';

const module = angular.module('application.services', ['firebase.database', 'ngResource']);
export default {
  taxonomy: module.factory('AlchemyTaxonomyService', AlchemyTaxonomyService.serviceImpl).name,
  keywords: module.factory('AlchemyKeywordService', AlchemyKeywordService.serviceImpl).name,
  personality: module.factory('PersonalityInsightsService', PersonalityInsightsService.serviceImpl).name,
  visual: module.factory('VisualRecognitionService', VisualRecognitionService.serviceImpl).name
};
