import type { ReactNode } from 'react';

export interface ClaimItem {
  id: string;
  number: string;
  status: string;
  sla_status?: string;
  currency?: string;
  amount_approved?: number;
  edited_by?: string;
  policy_data?: {
    policy_holder?: {
      name?: string;
    };
  };
  package?: {
    plan?: {
      name?: string;
    };
  };
  benefit?: {
    description_en?: string;
  };
  claim?: Array<{
    type: string;
    name: string;
    value: any;
  }>;
  updated_at?: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: string;
  label?: {
    en?: string;
  };
  label_multilanguage?: {
    en?: string;
  };
  criteria?: string;
  definition?: string;
  pending_reason_message?: {
    en?: string;
  };
  fields?: Array<{
    name: string;
    type: string;
    label?: {
      en?: string;
    };
    label_multilanguage?: {
      en?: string;
    };
    criteria?: string;
    definition?: string;
    pending_reason_message?: {
      en?: string;
    };
  }>;
}

export interface ClaimsTableConfigProps {
  page: number;
  rowsPerPage: number;
  claimIdColumnSize: number;
  customerNameColumnSize: number;
  planNameColumnSize: number;
  currencyColumnSize: number;
  amountColumnSize: number;
  lastModifiedColumnSize: number;
  statusColumnSize: number;
  actionColumnSize: number;
  renderStatusCell: (claim: ClaimItem) => ReactNode;
  onViewDetail: (claimId: string) => void;
}

export interface DocumentTableConfigProps {
  selectedDocuments: string[];
  onCheckboxChange: (docName: string) => void;
  onSelectDocument: () => void;
  isDocumentSelected: (docName: string) => boolean;
}

export interface ClaimForm {
  id: string;
  channel?: string;
  category?: string;
  name: string;
  type: string;
  label: string | any;
  label_multilanguage?: any;
  value?: string;
  required: boolean;
  fields?: ClaimForm[];
  lack_of_document_only?: boolean;
  api?: string;
  key?: string;
  criteria?: string;
  definition?: string;
  pending_reason_message?: any;
  options: any;
  options_multilanguage?: any;
  form: string;
  condition: any;
  insured_type?: string;
}

export enum ClaimFieldInputType {
  File = 'file',
  FileMultiple = 'file multiple',
  MultipleFile = 'multiple file',
  String = 'string',
  Number = 'number',
  Datetime = 'datetime',
  Date = 'date',
  Select = 'select',
  SelectFromAPI = 'select-from-api',
  Fields = 'fields',
  Radio = 'radio',
  Checkbox = 'checkbox',
}

export interface ClaimFormsRequest {
  name?: string;
  channel?: string;
}

export interface PersonalInfo {
  phone: string;
  country?: string;
  state?: string;
  city?: string;
  district?: string;
  subdistrict?: string;
  address?: string;
  address2?: string;
}

export interface BankInfo {
  bank: any;
  branch: string;
  account_number: string;
  account_name: string;
}

export interface ReporterInfo {
  is_insured: boolean;
  data?: Reporter | null;
}

export interface Reporter {
  name: string;
  relationship: string;
  phone: string;
}

export interface UpdateClaimGrabRequest {
  policy?: string;
  benefit?: string;
  package?: string;
  participant?: string;
  participant_data?: any;
  personal_info?: PersonalInfo;
  bank_info?: BankInfo;
  reporter?: ReporterInfo;
  insured_type?: string;
  form: any;
  other_info?: any;
}

export interface CreateClaimResponse {
  id: string;
}
