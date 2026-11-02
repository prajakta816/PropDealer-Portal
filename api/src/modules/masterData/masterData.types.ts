import type {MasterDataCategory} from '../../constants/masterData.js';

 export interface CreateMasterDataRepoInput{
    category: MasterDataCategory;
    value   : string;
 }

 export interface UpdateMasterDataRepoInput{
    category?: MasterDataCategory;
    value?: string;
 }

  export interface MasterDataRecord{
    id       : string;
    category : MasterDataCategory;
    value    : string;
    createdAt: Date;
    updatedAt: Date;
  }