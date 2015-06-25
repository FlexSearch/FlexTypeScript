/// <reference path="..\references\references.d.ts" />

module flexportal {
	
	import SearchResults = FlexSearch.Core.SearchResults;
	
	export class FlexClient {
		private $http: ng.IHttpService;
		
        /* @ngInject */
		constructor($http: ng.IHttpService) {
			 this.$http = $http;
		}
		
		private static getSearchResults (response : any) {
			return <SearchResults>response.data.Data;
		}
		
		private static getFirstResponse (results: SearchResults) {
			// Get the first response
			if (results.Documents.length != 1) { 
				errorHandler("No results returned."); 
				return null; 
			}
			
			return results.Documents[0];
		}
		
		private static getData (response: any) {
			return response.data.Data;
		}
		
		private static getFlatResults (response: any) {
			return <string[]>FlexClient.getData(response);
		}
		
		public getRecordById(indexName, id) {
			var url = FlexSearchUrl + "/indices/" + indexName + "/documents/" + id + "?c=*";
			return this.$http.get(url)
				.then(
					response => <FlexSearch.Core.DocumentDto>(<any>response.data).Data,
					errorHandler);
	  	}
		  
	  	public getRecordsByIds(indexName, ids: any []) {
			var idStr = ids
				.reduce(function (acc, val) { return acc + ",'" + val + "'" }, "")
				.substr(1);
		  	return this.$http.get(FlexSearchUrl + "/indices/" + indexName + "/search", { params: 
				  {
					 q: "_id eq [" + idStr + "] {clausetype: 'or'}",
					 c: "*",
					 returnFlatResult: "true"
				  } })
			  .then(FlexClient.getFlatResults);
	  	}
		  
	  	// Get the duplicate that needs to be displayed
		public getDuplicateBySourceId(sessionId, sourceId) {
			return this.$http.get(DuplicatesUrl + "/search", {params: {
				q: "type = 'source' and sessionid = '" + sessionId + "' and sourceid = '" + sourceId + "'",		
				c: "*" }}
			)
			.then(FlexClient.getSearchResults, errorHandler)
	      	.then(FlexClient.getFirstResponse, errorHandler);
	  	}
		  
	  	public updateDuplicate(duplicate: Duplicate) {
			return this.$http.put(DuplicatesUrl + "/documents/" + duplicate.FlexSearchId,
			{
				Fields: {
				  sessionid: duplicate.SessionId,
				  sourcedisplayname: duplicate.SourceDisplayName,
				  sourceid: duplicate.SourceId,
				  sourcerecordid: duplicate.SourceRecordId,
				  totaldupesfound: duplicate.TotalDupes,
				  type: "source",
				  sourcestatus: duplicate.SourceStatus,
				  targetrecords: JSON.stringify(duplicate.Targets)
				},
				Id: duplicate.FlexSearchId,
				IndexName: "duplicates"
			});
	  	}
		  
		public getSessionBySessionId(sessionId) {
		  return this.$http.get(DuplicatesUrl + "/search", 
		        { params: { 
		            q: "type = 'session' and sessionid = '" + sessionId + "'",
		            c: "*" } }
		    )
		    .then(FlexClient.getSearchResults, errorHandler)
			.then(FlexClient.getFirstResponse, errorHandler);
		} 
		
		public getDuplicatesFromSession(sessionId, count, skip, sortby?, sortDirection?) {
            return this.$http.get(DuplicatesUrl + "/search", 
                { params: { 
                    q: "type = 'source' and sessionid = '" + sessionId + "'",
                    c: "*",
                    count: count,
                    skip: skip,
					orderBy: sortby,
			  		orderByDirection: sortDirection }})
			.then(FlexClient.getSearchResults, errorHandler);
		}
		
		public getSessions(count, skip, sortby?, sortDirection?) {
			
			return this.$http.get(DuplicatesUrl + "/search", { params: {
	          c: "*",
	          q: "type = 'session'",
	          skip: skip,
	          count: count,
			  orderBy: sortby,
			  orderByDirection: sortDirection
	        }})
			.then(FlexClient.getSearchResults, errorHandler);
		}
		
		public getIndices() {
			return this.$http.get(FlexSearchUrl + "/indices")
				.then(FlexClient.getData, errorHandler)
				.then(result => <any[]> result, errorHandler);
		}
		
		public submitDuplicateDetection(indexName, searchProfile, displayFieldName, selectionQuery) {
			return this.$http.post(FlexSearchUrl + "/indices/" + indexName + "/duplicatedetection/" + searchProfile, {
					DisplayName: displayFieldName,
					SelectionQuery: selectionQuery
				});
		}
	}
}