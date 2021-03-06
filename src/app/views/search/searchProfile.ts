/// <reference path="../../references/references.d.ts" />

module flexportal {
  'use strict';
  
  export class SearchProfileController {
    /* @ngInject */
    constructor($scope: ISearchBase, $state: any, flexClient: FlexClient) {
      // ---- Important ---- //
      // Almost all updates will have to be passed to the parent scope
      // ---- Important ---- //
      var parentScope = (<ISearchBase>$scope.$parent);
      
      // Show the Search Profile dropdown
      parentScope.showSearchProfileDropDown = true;
      
      // Function that submits the Search Profile test to FlexSearch
      parentScope.submit = function(index: Index) {
        // Build the Search Query String
        var searchQueryString = index.Fields
          .filter(f => f.Value != undefined && f.Value != "")
          .map(f => f.Name + ":'" + f.Value + "'")
          .join(",");
          
         // Colate the columns to retrieve
         var columns = index.Fields
            .filter(f => f.Show)
            .map(f => f.Name);
          
         flexClient.submitSearchProfileTest(index.Name, 
           searchQueryString || "_id matchall 'x'", 
           parentScope.spQueryString,
           columns.length == 0 ? undefined : columns, parentScope.RecordsToRetrieve)
           .then(result => {
             var r = new Response();
             r.RecordsReturned = result.RecordsReturned;
             r.TotalAvailable = result.TotalAvailable;
             r.FieldNames = [];
             r.Documents = [];
             for (var i in result.Documents) {
               var doc = result.Documents[i];
               // Populate the field names if they're empty
               if (r.FieldNames.length == 0)
                 r.FieldNames = Object.keys(doc.Fields);
                 
               r.Documents.push(doc.Fields);
             }
             
             parentScope.Response = r;
           })
           .then(() => {
             parentScope.PageCount = Math.ceil(parentScope.Response.RecordsReturned / parentScope.PageSize);
             parentScope.getPage(1);
           });
      };
      
      // Function to show settings for search request
      parentScope.showSettings = function($event){
         parentScope.$settingsBottomSheet.show({
            templateUrl: 'app/views/search/searchProfileSettings.html',
            controller: 'SearchProfileSettingsController',
            targetEvent: $event,
            parent: $('.leftColumn'),
            scope: parentScope,
            preserveScope: true
          });
      }
    }
  }
}
