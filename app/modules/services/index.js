import 'firebase';
import TaxonomyService from './taxonomy-service';
import PersonalityInsightsService from './personality-insights-service';

const module = angular.module('application.services', ['firebase.database', 'ngResource']);
export default {
  taxonomy: module.factory('TaxonomyService', TaxonomyService.serviceImpl).name,
  personality: module.factory('PersonalityInsightsService', PersonalityInsightsService.serviceImpl).name
};
