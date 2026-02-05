export type {
  PolicyData,
  Participant as PolicyParticipant,
  PolicyProductResponse,
} from "@/services/policy.service";
export type {
  MembershipData,
  Participant as MembershipParticipant,
  MembershipProductResponse,
} from "@/services/membership.service";

export interface EndorsementResponse {
  data: unknown;
  page?: number;
  total?: number;
  pageTotal?: number;
  [key: string]: unknown;
}
