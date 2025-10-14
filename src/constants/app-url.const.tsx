class AppURL {
  // Dashboard
  static dashboard = "/dashboard";
  static dashboardHome = `${AppURL.dashboard}/home`;
  static dashboardTransaction = `${AppURL.dashboard}/transaction`;
  static dashboardPolicy = `${AppURL.dashboard}/policy`;
  static dashboardClaim = `${AppURL.dashboard}/claim`;
  static dashboardInsightReport = `${AppURL.dashboard}/insight-report`;

  // Policy
  static policy = "/policy";
  static policyList = `${AppURL.policy}/list`;
  static policyDetail = `${AppURL.policyList}/detail`;
  static endorsement = `${AppURL.policy}/endorsement`;
  static endorsementList = `${AppURL.endorsement}/list`;
  static endorsementDetail = `${AppURL.endorsementList}/detail`;
  static endorsementUpload = `${AppURL.endorsementList}/upload`;
  static endorsementExport = `${AppURL.endorsementList}/export`;

  // Claim
  static claim = "/claim";
  static claimList = `${AppURL.claim}/list`;
  static claimDetail = `${AppURL.claimList}/detail`;
  static claimHistory = `${AppURL.claim}/history`;

  // Transaction
  static transaction = "/transaction";
  static transactionList = `${AppURL.transaction}/list`;
  static transactionDetail = `${AppURL.transactionList}/detail`;
  static transactionAdd = `${AppURL.transactionList}/add`;
  static transactionRevenue = `${AppURL.transaction}/revenue`;
  static transactionCountries = `${AppURL.transaction}/countries`;
  static transactionExport = `${AppURL.transactionList}/export`;
  static transactionImport = `${AppURL.transactionList}/import`;

  // Customer
  static customer = "/customer";
  static customerList = `${AppURL.customer}/list`;
  static customerAdd = `${AppURL.customerList}/add`;

  // Plan
  static plan = "/plan";
  static planList = `${AppURL.plan}/list`;
  static planDetail = `${AppURL.planList}/detail`;
  static planAdd = `${AppURL.planList}/add`;

  // Master Data
  static masterdata = "/masterdata";
  static masterdataProduct = `${AppURL.masterdata}/product`;
  static masterdataProductDetail = `${AppURL.masterdataProduct}/detail`;
  static masterdataProductAdd = `${AppURL.masterdataProduct}/add`;

  static masterdataProductCategory = `${AppURL.masterdata}/product-category`;
  static masterdataProductCategoryDetail = `${AppURL.masterdataProductCategory}/detail`;
  static masterdataProductCategoryAdd = `${AppURL.masterdataProductCategory}/add`;

  static masterdataInsurance = `${AppURL.masterdata}/insurance`;
  static masterdataInsuranceDetail = `${AppURL.masterdataInsurance}/detail`;
  static masterdataInsuranceAdd = `${AppURL.masterdataInsurance}/add`;

  static masterdataCurrency = `${AppURL.masterdata}/currency`;
  static masterdataCurrencyDetail = `${AppURL.masterdataCurrency}/detail`;
  static masterdataCurrencyAdd = `${AppURL.masterdataCurrency}/add`;

  static masterdataChannel = `${AppURL.masterdata}/channel`;
  static masterdataChannelDetail = `${AppURL.masterdataChannel}/detail`;
  static masterdataChannelAdd = `${AppURL.masterdataChannel}/add`;

  static masterdataUser = `${AppURL.masterdata}/user`;
  static masterdataUserDetail = `${AppURL.masterdataUser}/detail`;
  static masterdataUserAdd = `${AppURL.masterdataUser}/add`;

  static masterdataGroup = `${AppURL.masterdata}/group`;
  static masterdataGroupDetail = `${AppURL.masterdataGroup}/detail`;
  static masterdataGroupAdd = `${AppURL.masterdataGroup}/add`;

  static masterdataRole = `${AppURL.masterdata}/role`;
  static masterdataRoleDetail = `${AppURL.masterdataRole}/detail`;
  static masterdataRoleAdd = `${AppURL.masterdataRole}/add`;

  static masterdataPageManagement = `${AppURL.masterdata}/page-management`;
  static masterdataPageManagementDetail = `${AppURL.masterdataPageManagement}/detail`;
  static masterdataPageManagementAdd = `${AppURL.masterdataPageManagement}/add`;

  static masterdataPartnerManagement = `${AppURL.masterdata}/partner-management`;
  static masterdataPartnerManagementDetail = `${AppURL.masterdataPartnerManagement}/detail`;
  static masterdataPartnerManagementAdd = `${AppURL.masterdataPartnerManagement}/add`;

  static masterdataEmailTemplate = `${AppURL.masterdata}/email-template`;
  static masterdataEmailTemplateDetail = `${AppURL.masterdataEmailTemplate}/detail`;
  static masterdataEmailTemplateAdd = `${AppURL.masterdataEmailTemplate}/add`;

  static masterdataEmailTag = `${AppURL.masterdata}/email-tag`;
  static masterdataEmailTagDetail = `${AppURL.masterdataEmailTag}/detail`;
  static masterdataEmailTagAdd = `${AppURL.masterdataEmailTag}/add`;

  static masterdataHolidayDate = `${AppURL.masterdata}/holiday-date`;
  static masterdataHolidayDateDetail = `${AppURL.masterdataHolidayDate}/detail`;
  static masterdataHolidayDateAdd = `${AppURL.masterdataHolidayDate}/add`;

  static masterdataHospital = `${AppURL.masterdata}/hospital`;

  // Configuration
  static configuration = "/configuration";
  static configurationSla = `${AppURL.configuration}/sla`;

  // Finance
  static finance = "/finance";
  static financeBilling = `${AppURL.finance}/billing`;
  static financeBillingDetail = `${AppURL.financeBilling}/detail`;
  static financeBillingAdd = `${AppURL.financeBilling}/add`;
  static financeUnmatchBilling = `${AppURL.finance}/unmatch-billing`;
  static financeBrokerFee = `${AppURL.finance}/broker-fee`;
  static financeBrokerFeeDetail = `${AppURL.financeBrokerFee}/detail`;
  static financeBrokerFeeAdd = `${AppURL.financeBrokerFee}/add`;
  static financePartnerComm = `${AppURL.finance}/partner-comm`;
  static financePartnerCommDetail = `${AppURL.financePartnerComm}/detail`;
  static financePartnerCommAdd = `${AppURL.financePartnerComm}/add`;

  // Membership
  static membership = "/membership";
  static membershipList = `${AppURL.membership}/list`;
  static membershipDetail = `${AppURL.membershipList}/detail`;

  // Sanction
  static sanction = "/sanction";
  static sanctionList = `${AppURL.sanction}/list`;
  static sanctionDetail = `${AppURL.sanctionList}/detail`;
  static sanctionAdd = `${AppURL.sanctionList}/add`;
  static sanctionUpload = `${AppURL.sanctionList}/upload`;

  // Source
  static source = "/source";
  static sourceList = `${AppURL.source}/list`;
  static sourceDetail = `${AppURL.sourceList}/detail`;
  static sourceAdd = `${AppURL.sourceList}/add`;

  // Promotion
  static promotion = "/promotion";
  static promotionCampaign = `${AppURL.promotion}/campaign`;
  static promotionCampaignDetail = `${AppURL.promotionCampaign}/detail`;
  static promotionCampaignAdd = `${AppURL.promotionCampaign}/add`;
  static promotionCampaignEdit = `${AppURL.promotionCampaign}/edit`;

  // Report
  static report = "/report";
  static reportClaim = `${AppURL.report}/claim`;
  static reportCampaign = `${AppURL.report}/campaign`;
  static reportPerformance = `${AppURL.report}/performance`;

  // Standalone
  static productCategory = "/product-category";
  static forbidden = "/forbidden";
}

export default AppURL;
