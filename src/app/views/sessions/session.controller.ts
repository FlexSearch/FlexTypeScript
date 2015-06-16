module flexportal {
  'use strict';
  class TargetRecord{
    targetdisplayname: string;
    
  }
  class SourceRecord {
    sessionid: string;
    type: string;
    sourceid: string;
    sourcerecordid: string;
    sourcedisplayname: string;
    totaldupesfound: string;
    sourcestatus: string;
    targetrecords: TargetRecord[];
    sessionproperties: string;
    misc: string;
  }

  export interface Document {
    Fields: SourceRecord;
    Id: string;
    TimeStamp: any;
    IndexName: string;
    Highlights: any[];
    Score: number;
  }

  export interface Data {
    Documents: Document[];
    RecordsReturned: number;
    TotalAvailable: number;
  }

  export interface RootObject {
    Data: Data;
    Error?: any;
  }

  interface ISessionProperties extends ng.IScope {
    SessionId: string
    duplicates: SourceRecord[]
  }

  interface Parameters extends angular.ui.IStateParamsService {
    id: string
  }

  export class SessionController {
    /* @ngInject */
    constructor($scope: ISessionProperties, $stateParams: Parameters) {
      $scope.SessionId = $stateParams.id;
      $scope.duplicates = [];
      var field = new SourceRecord();
      field.sourcedisplayname = 'Seemant Rajvanshi';
      var target = new TargetRecord();
      target.targetdisplayname = 'Simant Rajvanshi';
      field.targetrecords = [];
      field.targetrecords.push(target);
      field.targetrecords.push(target);
      
      for(var i=0;i++;i<10){
        field.totaldupesfound = i.toString();
        $scope.duplicates.push(field);        
      }
    }
  }
}
