import type {MasterDataCategory} from '../../constants/masterData.js';

 export interface CreateMasterDataRepoInput{
    category: MasterDataCategory;
    value   : string;
    createdById : string;
    updatedById : string;
 }

 export interface UpdateMasterDataRepoInput{
    category?: MasterDataCategory;
    value?: string;
    updatedById : string;
 }

  export interface MasterDataRecord{
    id       : string;
    category : MasterDataCategory;
    value    : string;
    createdAt: Date;
    updatedAt: Date;
    createdById : string | null;
    updatedById : string | null;
  }