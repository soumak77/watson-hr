import 'firebase';
import TaxonomyService from './taxonomy-service';

export default {
  taxonomy: angular.module('application.services', ['firebase.database', 'ngResource'])
    .factory('TaxonomyService', TaxonomyService.serviceImpl)
    .name
};
