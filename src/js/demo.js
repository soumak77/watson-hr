/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint camelcase: "off", no-undef: "off" */

/* global _:true */
'use strict';

$(document).ready(function() {
  var authors_template = authorsTemplate.innerHTML;
  var concepts_template = conceptsTemplate.innerHTML;
  var entities_template = entitiesTemplate.innerHTML;
  var targetedsentiment_template = targetedsentimentTemplate.innerHTML;
  var emotion_template = emotionTemplate.innerHTML;
  var targetedemotion_template = targetedemotionTemplate.innerHTML;
  var sentiment_template = sentimentTemplate.innerHTML;
  var keywords_template = keywordsTemplate.innerHTML;
  var title_template = titleTemplate.innerHTML;
  var feeds_template = feedsTemplate.innerHTML;
  var taxonomy_template = taxonomyTemplate.innerHTML;
  var language_template = languageTemplate.innerHTML;
  var relations_template = relationsTemplate.innerHTML;
  var text_template = textTemplate.innerHTML;
  var date_template = dateTemplate.innerHTML;
  var typedrelations_template = typedRelationsTemplate.innerHTML;

  $('.tab-panels--tab').click(function(e) {
    e.preventDefault();
    var self = $(this);
    var inputGroup = self.closest('.tab-panels');
    var idName = null;

    inputGroup.find('.active').removeClass('active');
    self.addClass('active');
    idName = self.attr('href');
    $(idName).addClass('active');
  });

  $('#submitbutton').click(function() {
    if ($('.tab-panels--tab.active').text() === 'Body of Text') {
      callAPIswithText($('.input--text').val());
    } else {
      callAPIswithURL($('.input--URL').val());
    }
  });

  $('#submitbutton-tr').click(function() {
    if ($('.tab-panels--tab.active').text() === 'Body of Text') {
      callAPIswithTR($('.input--text').val());
    } else {
      callAPIswithTRurl($('.input--URL').val());
    }
  });

  function callAPIswithText(text) {
    getAuthors();
    getLanguageConcepts(text);
    getLanguageDate();
    getLanguageEmotion(text);
    getTargetedEmotion(text);
    getLanguageSentiment(text);
    getLanguageEntities(text);
    getLanguageFeeds();
    getLanguageKeywords(text);
    getLanguageLanguage(text);
    getLanguageRelations(text);
    getLanguageTargetedSentiment(text);
    getLanguageTaxonomy(text);
    getLanguageText();
    getLanguageTitle();
    gettypedRelations(text);
  }
  function callAPIswithTR(text) {
    getLanguageEntitiesTyped(text);
    gettypedRelationsTyped(text);
  }

  function callAPIswithTRurl(url) {
    getLanguageEntitiesTypedURL(url);
    gettypedRelationsTypedURL(url);
  }
  function callAPIswithURL(url) {
    getAuthorsURL(url);
    getLanguageConceptsURL(url);
    getLanguageDateURL(url);
    getLanguageEmotionURL(url);
    getTargetedEmotionURL(url);
    getLanguageSentimentURL(url);
    getLanguageEntitiesURL(url);
    getLanguageFeedsURL(url);
    getLanguageKeywordsURL(url);
    getLanguageLanguageURL(url);
    getLanguageRelationsURL(url);
    getLanguageTargetedSentimentURL(url);
    getLanguageTaxonomyURL(url);
    getLanguageTextURL(url);
    getLanguageTitleURL(url);
    gettypedRelationsURL(url);
  }
  function getAuthors() {
    $('.authors-table').html('<tr class="base--tr"><td class="base--td">This function only gives results with a URL input. Please try using a URL to see results.</td></tr>');
  }
  function getLanguageDate() {
    $('.date-table').html('<tr class="base--tr"><td class="base--td">This function only gives results with a URL input. Please try using a URL to see results.</td></tr>');
  }
  function getLanguageFeeds() {
    $('.feeds-table').html('<tr class="base--tr"><td class="base--td">This function only gives results with a URL input. Please try using a URL to see results.</td></tr>');
  }
  function getLanguageText() {
    $('.text-table').html('<tr class="base--tr"><td class="base--td">This function only gives results with a URL input. Please try using a URL to see results.</td></tr>');
  }
  function getLanguageTitle() {
    $('.title-table').html('<tr class="base--tr"><td class="base--td">This function only gives results with a URL input. Please try using a URL to see results.</td></tr>');
  }


  function getLanguageConcepts(text) {
    $('.conceptsTemplate').html('');
    $.post('/api/concepts', {
      'text': text,
      linkedData: 1
    }, function(data) {
      $('.concepts-table').html(_.template(concepts_template, {
        items: data.concepts
      }));

      $('#concept-API-data').empty();
      $('#concept-API-data').html(JSON.stringify(data, null, 2));
    })
    .fail(_error);
  }

  function getLanguageEmotion(text) {
    $.post('/api/emotion', {
      'text': text
    }, function(data) {
      $('.emotion-table').html(_.template(emotion_template, {
        items: data.docEmotions
      }));
      $('#emotion-API-data').empty();
      $('#emotion-API-data').html(JSON.stringify(data, null, 2));
    }).fail(_error);
  }

  function getTargetedEmotion(text) {
    var keywordsArray = [];
    $.post('/api/keywords', {
      'text': text,
      emotion: 1
    }, function(data) {
      data.keywords.forEach(function(keyword) {
        keywordsArray.push(keyword.text);
      });
      $.post('/api/emotion', {
        'text': text,
        'targets': keywordsArray
      }, function(emotionData) {
        $('.targetedemotion-table').html(_.template(targetedemotion_template, {
          items: emotionData.results
        }));
      }).fail(_error);
      $('#targeted-emotion-API-data').empty();
      $('#targeted-emotion-API-data').html(JSON.stringify(data, null, 2));
    }).fail(_error);
  }

  function getTargetedEmotionURL(url) {
    var keywordsArray = [];
    $.post('/api/keywords', {
      'url': url,
      emotion: 1
    }, function(data) {
      data.keywords.forEach(function(keyword) {
        keywordsArray.push(keyword.text);
      });
      $.post('/api/emotion', {
        'url': url,
        'targets': keywordsArray
      }, function(emotionData) {
        $('.targetedemotion-table').html(_.template(targetedemotion_template, {
          items: emotionData.results
        }));
      }).fail(_error);
      $('#targeted-emotion-API-data').empty();
      $('#targeted-emotion-API-data').html(JSON.stringify(data, null, 2));
    }).fail(_error);
  }

  function getLanguageSentiment(text) {
    $.post('/api/sentiment', {
      'text': text
    }, function(data) {
      $('.sentiment-table').html(_.template(sentiment_template, {
        items: data.docSentiment
      }));
      $('#sentiment-API-data').empty();
      $('#sentiment-API-data').html(JSON.stringify(data, null, 2));
    }).fail(_error);
  }

  function getLanguageSentimentURL(url) {
    $.post('/api/sentiment', {
      'url': url
    }, function(data) {
      $('.sentiment-table').html(_.template(sentiment_template, {
        items: data.docSentiment
      }));
      $('#sentiment-API-data').empty();
      $('#sentiment-API-data').html(JSON.stringify(data, null, 2));
    }).fail(_error);
  }

  function getLanguageTargetedSentiment(text) {
    var keywordsArray = [];
    $.post('/api/keywords', {
      'text': text,
      sentiment: 1
    }, function(data) {
      data.keywords.forEach(function(keyword) {
        keywordsArray.push(keyword.text);
      });

      $.post('/api/sentiment', {
        'text': text,
        'targets': keywordsArray
      }, function(sentimenData) {
        $('.targetedsentiment-table').html(_.template(targetedsentiment_template, {
          items: sentimenData.results
        }));
      }).fail(_error);
      $('#targetedsentiment-API-data').empty();
      $('#targetedsentiment-API-data').html(JSON.stringify(data, null, 2));
    }).fail(_error);
  }

  function gettypedRelations(text) {
    $.post('/api/typedRelations', {
      'text': text,
      entities: 1,
      keywords: 1,
      arguments: 1
    }, function(data) {
      $('.typedrelations-table').html(_.template(typedrelations_template, {
        items: data.typedRelations
      }));
      $('#typedrelations-API-data').empty();
      $('#typedrelations-API-data').html(JSON.stringify(data, null, 2));
    }).fail(_error);
  }

  function gettypedRelationsURL(url) {
    $.post('/api/typedRelations', {
      'url': url,
      entities: 1,
      keywords: 1,
      arguments: 1
    }, function(data) {
      $('.typedrelations-table').html(_.template(typedrelations_template, {
        items: data.typedRelations
      }));
      $('#typedrelations-API-data').empty();
      $('#typedrelations-API-data').html(JSON.stringify(data, null, 2));
    }).fail(_error);
  }

  function gettypedRelationsTyped(text) {
    var model = $('#model').val();
    $.post('/api/typedRelations', {
      'text': text,
      model: model,
      entities: 1,
      keywords: 1,
      arguments: 1
    }, function(data) {
      $('.typedrelations-table').html(_.template(typedrelations_template, {
        items: data.typedRelations
      }));
      $('#typedrelations-API-data').empty();
      $('#typedrelations-API-data').html(JSON.stringify(data, null, 2));
    }).fail(_error);
  }

  function getLanguageEntitiesTyped(text) {
    var model = $('#model').val();
    $.post('/api/entities', {
      'text': text,
      model: model,
      sentiment: 1,
      emotion: 1
    }, function(data) {
      $('.entities-table').html(_.template(entities_template, {
        items: data.entities
      }));
      $('#entities-API-data').empty();
      $('#entities-API-data').html(JSON.stringify(data, null, 2));
    }).fail(_error);
  }

  function gettypedRelationsTypedURL(url) {
    var model = $('#model').val();
    $.post('/api/typedRelations', {
      'url': url,
      model: model,
      entities: 1,
      keywords: 1,
      arguments: 1
    }, function(data) {
      $('.typedrelations-table').html(_.template(typedrelations_template, {
        items: data.typedRelations
      }));
      $('#typedrelations-API-data').empty();
      $('#typedrelations-API-data').html(JSON.stringify(data, null, 2));
    }).fail(_error);
  }

  function getLanguageEntitiesTypedURL(url) {
    var model = $('#model').val();
    $.post('/api/entities', {
      'url': url,
      model: model,
      sentiment: 1,
      emotion: 1
    }, function(data) {
      $('.entities-table').html(_.template(entities_template, {
        items: data.entities
      }));
      $('#entities-API-data').empty();
      $('#entities-API-data').html(JSON.stringify(data, null, 2));
    }).fail(_error);
  }


  function getLanguageEntities(text) {
    $.post('/api/entities', {
      'text': text,
      sentiment: 1,
      linkedData: 1,
      relevance: 1,
      emotion: 1,
      subType: 1
    }, function(data) {
      $('.entities-table').html(_.template(entities_template, {
        items: data.entities
      }));
      $('#entities-API-data').empty();
      $('#entities-API-data').html(JSON.stringify(data, null, 2));
    }).fail(_error);
  }

  function getLanguageKeywords(text) {
    $.post('/api/keywords', {
      'text': text,
      sentiment: 1,
      emotion: 1
    }, function(data) {
      $('.keywords-table').html(_.template(keywords_template, {
        items: data.keywords
      }));
      $('#keywords-API-data').empty();
      $('#keywords-API-data').html(JSON.stringify(data, null, 2));
    }).fail(_error);
  }

  function getLanguageLanguage(text) {
    $.post('/api/language', {
      'text': text
    }, function(data) {
      $('.language-table').html(_.template(language_template, {
        item: data
      }));
      $('#language-API-data').empty();
      $('#language-API-data').html(JSON.stringify(data, null, 2));
    }).fail(_error);
  }

  function getLanguageLanguageURL(url) {
    $.post('/api/language', {
      'url': url
    }, function(data) {
      $('.language-table').html(_.template(language_template, {
        item: data
      }));
      $('#language-API-data').empty();
      $('#language-API-data').html(JSON.stringify(data, null, 2));
    }).fail(_error);
  }

  function getLanguageRelations(text) {
    $.post('/api/relations', {
      'text': text,
      sentiment: 1,
      keywords: 1,
      entities: 1,
      temporal: 1
    }, function(data) {
      $('.relations-table').html(_.template(relations_template, {
        items: data.relations
      }));
      $('#relations-API-data').empty();
      $('#relations-API-data').html(JSON.stringify(data, null, 2));
    }).fail(_error);
  }

  function getLanguageTaxonomy(text) {
    $.post('/api/taxonomy', {
      'text': text
    }, function(data) {
      $('.taxonomy-table').html(_.template(taxonomy_template, {
        items: data.taxonomy
      }));
      $('#taxonomy-API-data').empty();
      $('#taxonomy-API-data').html(JSON.stringify(data, null, 2));
    }).fail(_error);
  }

  // ///////

  function getAuthorsURL(url) {
    $.post('/api/authors', {
      'url': url
    }, function(data) {
      $('.authors-table').html(_.template(authors_template, {
        items: data.authors.names
      }));

      $('#authors-API-data').empty();
      $('#authors-API-data').html(JSON.stringify(data, null, 2));
    }).fail(_error);
  }

  function getLanguageEmotionURL(url) {
    $.post('/api/emotion', {
      'url': url
    }, function(data) {
      $('.emotion-table').html(_.template(emotion_template, {
        items: data.docEmotions
      }));
      $('#emotion-API-data').empty();
      $('#emotion-API-data').html(JSON.stringify(data, null, 2));
    }).fail(_error);
  }

  function getLanguageConceptsURL(url) {
    $('.conceptsTemplate').html('');
    $.post('/api/concepts', {
      'url': url,
      linkedData: 1
    }, function(data) {
      $('.concepts-table').html(_.template(concepts_template, {
        items: data.concepts
      }));

      $('#concept-API-data').empty();
      $('#concept-API-data').html(JSON.stringify(data, null, 2));
    }).fail(_error);
  }

  function getLanguageDateURL(url) {
    $.post('/api/publicationDate', {
      'url': url
    }, function(data) {
      $('.date-table').html(_.template(date_template, {
        item: data.publicationDate
      }));
      $('#date-API-data').empty();
      $('#date-API-data').html(JSON.stringify(data, null, 2));
    }).fail(_error);
  }

  function getLanguageFeedsURL(url) {
    $.post('/api/feeds', {
      'url': url
    }, function(data) {
      $('.feeds-table').html(_.template(feeds_template, {
        items: data.feeds
      }));
      $('#feeds-API-data').empty();
      $('#feeds-API-data').html(JSON.stringify(data, null, 2));
    }).fail(_error);
  }

  function getLanguageTextURL(url) {
    $.post('/api/text', {
      'url': url
    }, function(data) {
      $('.text-table').html(_.template(text_template, {
        items: data
      }));
      $('#text-API-data').empty();
      $('#text-API-data').html(JSON.stringify(data, null, 2));
    }).fail(_error);
  }

  function getLanguageTitleURL(url) {
    $.post('/api/title', {
      'url': url
    }, function(data) {
      $('.title-table').html(_.template(title_template, {
        items: data
      }));
      $('#title-API-data').empty();
      $('#title-API-data').html(JSON.stringify(data, null, 2));
    }).fail(_error);
  }

  function getLanguageEntitiesURL(url) {
    $.post('/api/entities', {
      'url': url,
      sentiment: 1,
      linkedData: 1,
      relevance: 1,
      emotion: 1,
      subType: 1
    }, function(data) {
      $('.entities-table').html(_.template(entities_template, {
        items: data.entities
      }));
      $('#entities-API-data').empty();
      $('#entities-API-data').html(JSON.stringify(data, null, 2));
    }).fail(_error);
  }

  function getLanguageKeywordsURL(url) {
    $.post('/api/keywords', {
      'url': url,
      sentiment: 1,
      emotion: 1
    }, function(data) {
      $('.keywords-table').html(_.template(keywords_template, {
        items: data.keywords
      }));
      $('#keywords-API-data').empty();
      $('#keywords-API-data').html(JSON.stringify(data, null, 2));
    }).fail(_error);
  }

  function getLanguageRelationsURL(url) {
    $.post('/api/relations', {
      'url': url,
      sentiment: 1,
      keywords: 1,
      entities: 1,
      temporal: 1
    }, function(data) {
      $('.relations-table').html(_.template(relations_template, {
        items: data.relations
      }));
      $('#relations-API-data').empty();
      $('#relations-API-data').html(JSON.stringify(data, null, 2));
    }).fail(_error);
  }

  function getLanguageTaxonomyURL(url) {
    $.post('/api/taxonomy', {
      'url': url
    }, function(data) {
      $('.taxonomy-table').html(_.template(taxonomy_template, {
        items: data.taxonomy
      }));
      $('#taxonomy-API-data').empty();
      $('#taxonomy-API-data').html(JSON.stringify(data, null, 2));
    }).fail(_error);
  }

  function getLanguageTargetedSentimentURL(url) {
    var keywordsArray = [];
    $.post('/api/keywords', {
      'url': url,
      sentiment: 1
    }, function(data) {
      data.keywords.forEach(function(keyword) {
        keywordsArray.push(keyword.text);
      });

      $.post('/api/sentiment', {
        'url': url,
        'targets': keywordsArray
      }, function(sentimenData) {
        $('.targetedsentiment-table').html(_.template(targetedsentiment_template, {
          items: sentimenData.results
        }));
      }).fail(_error);
      $('#targetedsentiment-API-data').empty();
      $('#targetedsentiment-API-data').html(JSON.stringify(data, null, 2));
    }).fail(_error);
  }

  function _error(error) {
    console.log(error);
  }

  // CSRF
  $.ajaxSetup({
    headers: {
      'csrf-token': $('meta[name="ct"]').attr('content')
    }
  });
});
