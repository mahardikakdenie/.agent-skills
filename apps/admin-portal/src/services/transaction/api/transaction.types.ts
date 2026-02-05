export type {
  Transaction,
  Customer,
  Insurance,
  TransactionFee,
  Participant,
} from "@/services/transaction.service";

export interface TransactionListResponse {
  data: unknown;
  limit?: number;
  page?: number;
  pageTotal?: number;
  total?: number;
}
