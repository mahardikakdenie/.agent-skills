class ApiURL {
    static maxRetries = 3;
    static maxTimeout = 10000;
    static timeoutInterval = 1000;
    static errorStatusCodeToGetToken = [401, 403];

    static api = "/api";

    static cookie = `${ApiURL.api}/cookie`;
    static cookieDetails = (key: string) => { return `${ApiURL.cookie}/${key}` };

    static sso = "/sso";
    static ssoLogin = `${ApiURL.sso}/login`;

    static login = "/login";

    static account = "/account";
    static v1Account = `/v1${ApiURL.account}`;
    static v1ChangePassword = (id: string) => { return `${ApiURL.v1Account}/${id}/change-password` };

    static policies = "/policies";
    static v1Policies = `/v1${ApiURL.policies}`;
    static policyDetails = (id: string) => { return `${ApiURL.policies}/${id}` };
    static v1PolicyDetails = (id: string) => { return `${ApiURL.v1Policies}/${id}` };
    static v1PolicyDetailsRenew = (id: string) => { return `${ApiURL.v1PolicyDetails(id)}/renew` };
    static policiesStatistic = `${ApiURL.policies}/statistic`;
    static policiesStatisticData = `${ApiURL.policies}/statistic-data`;
    static v1PoliciesStatisticData = `${ApiURL.v1Policies}/statistic-data`;
    static policiesStatisticYearly = `${ApiURL.policies}/statistic-yearly`;
    static v1PoliciesUpload = `${ApiURL.v1Policies}/upload`;
    static v1PoliciesUploadDrgadget = `${ApiURL.v1PoliciesUpload}/drgadget`;
    static v1PoliciesMaster = `${ApiURL.v1Policies}/master`;
    static v1PoliciesMasterDetail = (channel_id: string) => { return `${ApiURL.v1Policies}/master/${channel_id}` };

    static claims = "/claims";
    static v1Claims = `/v1${ApiURL.claims}`;
    static claimHistories = "/claim-histories";
    static v1ClaimHistories = `/v1${ApiURL.claimHistories}`;
    static claimCategoryForms = "/claim-category-forms";
    static v1ClaimCategoryForms = `/v1${ApiURL.claimCategoryForms}`;
    static claimChannelForms = "/claim-channel-forms";
    static v1ClaimChannelForms = `/v1${ApiURL.claimChannelForms}`;
    static claimConfigurations = `${ApiURL.claims}/configurations`;
    static v1ClaimConfigurations = `${ApiURL.v1Claims}/configurations`;
    static claimStatistic = `${ApiURL.claims}/statistic`;
    static claimStatisticData = `${ApiURL.claims}/statistic-data`;
    static v1ClaimStatisticData = `${ApiURL.v1Claims}/statistic-data`;
    static claimDetails = (id: string) => { return `${ApiURL.claims}/${id}` };
    static v1ClaimDetails = (id: string) => { return `${ApiURL.v1Claims}/${id}` };
    static claimUpdateStatus = (id: string) => { return `${ApiURL.claims}/update-status/${id}` };
    static v1ClaimUpdateStatus = (id: string) => { return `${ApiURL.v1Claims}/update-status/${id}` };
    static claimsExport = `${ApiURL.claims}/export`;
    static v1ClaimsExport = `${ApiURL.v1Claims}/export`;
    static claimsStatisticYearly = `${ApiURL.claims}/statistic-yearly`;
    static claimCategoryFormsAll = (id: string) => { return `${ApiURL.claimCategoryForms}/all/${id}` };
    static claimChannelFormsAll = (id: string) => { return `${ApiURL.claimChannelForms}/all/${id}` };
    static claimImport = `${ApiURL.claims}/import-data-guide`;
    static v1ClaimImport = `${ApiURL.v1Claims}/import-data-guide`;
    static claimImportSubmit = `${ApiURL.claims}/import`;
    static v1ClaimImportSubmit = `${ApiURL.v1Claims}/import`;
    static v1ClaimListLimit = `${ApiURL.v1Claims}/claim-list-limit`;
    static v1ClaimChannelFormsAll = (id: string) => { return `${ApiURL.v1ClaimChannelForms}/all/${id}` };
    static v1ClaimCategoryFormsAll = (id: string) => { return `${ApiURL.v1ClaimCategoryForms}/all/${id}` };

    static transactions = "/transactions";
    static v1Transactions = `/v1${ApiURL.transactions}`;
    static transactionsStatistic = `${ApiURL.transactions}/statistic`;
    static transactionsStatisticData = `${ApiURL.transactions}/statistic-data`;
    static v1TransactionsConventional = `${ApiURL.v1Transactions}/conventional`;
    static v1TransactionsStatisticData = `${ApiURL.v1Transactions}/statistic-data`;
    static transactionsStatisticYearly = `${ApiURL.transactions}/statistic-yearly`;
    static transactionComplete = `${ApiURL.transactions}/complete`;
    static transactionUpdateStatus = (id: string) => { return `${ApiURL.transactions}/payment/${id}` };
    static v1TransactionDetails = (id: string) => { return `${ApiURL.v1Transactions}/${id}` };
    static v1TransactionUpdateStatus = (id: string) => { return `${ApiURL.v1Transactions}/payment/${id}` };
    static v1TransactionBulkCreateDetails = (id: string) => { return `${ApiURL.v1Transactions}/bulk-create/${id}` };

    static categories = "/categories";
    static v1Categories = `/v1${ApiURL.categories}`;
    static categoriesByChannel = `${ApiURL.categories}/channel`;
    static v1CategoriesChannel = `${ApiURL.v1Categories}/channel`;
    static v1CategoriesChannelDetails = (id: string) => { return `${ApiURL.v1CategoriesChannel}/${id}` };

    static channels = "/channels";
    static v1Channels = `/v1${ApiURL.channels}`;
    static v1ChannelDetails = (id: string) => { return `${ApiURL.v1Channels}/${id}` };

    static packages = "/packages";
    static v1Packages = `/v1${ApiURL.packages}`;
    static v1PackagesDetails = (id: string) => { return `${ApiURL.v1Packages}/${id}` };
    static packagesCategory = (category: string) => { return `${ApiURL.packages}/${category}` };
    static packagesCategoryBulkCreate = (category: string) => { return `${ApiURL.packagesCategory(category)}/bulk-create` };
    static packagesCategoryBulkCreateDetail = (category: string, id: string) => { return `${ApiURL.packagesCategoryBulkCreate(category)}/${id}` };

    static channelPackages = "/channel-packages";
    static channelConfigurations = "/channel-configurations";
    static v1ChannelPackages = `/v1${ApiURL.channelPackages}`;
    static v1ChannelPackagesAssignPlans = `${ApiURL.v1ChannelPackages}/assign-plans`;
    static v1ChannelPackagesUnassignPlans = `${ApiURL.v1ChannelPackages}/unassign-plans`;

    static insurances = "/insurances";
    static v1Insurances = `/v1${ApiURL.insurances}`;
    static insuranceDetails = (id: string) => { return `${ApiURL.insurances}/${id}` };
    static v1InsuranceDetails = (id: string) => { return `${ApiURL.v1Insurances}/${id}` };
    static v1InsuranceDetailsCurrency = (id: string) => { return `${ApiURL.v1InsuranceDetails(id)}/currencies` };
    static v1InsuranceDetailsCurrencyDetails = (insuranceId: string, currencyId: string) => { return `${ApiURL.v1InsuranceDetailsCurrency(insuranceId)}/${currencyId}` };
    
    static products = "/products";
    static v1Products = `/v1${ApiURL.products}`;
    static productDetails = (id: string) => { return `${ApiURL.products}/${id}` };
    static v1ProductDetails = (id: string) => { return `${ApiURL.v1Products}/${id}` };

    static productConfig = "/product-config";
    static productConfigType = (type: string) => { return `${ApiURL.productConfig}/${type}` };

    static plans = "/plans";
    static v1Plans = `/v1${ApiURL.plans}`;
    static planBenefit = "/plan-benefit";
    static v1PlanBenefit = `/v1${ApiURL.planBenefit}`;
    static planDetails = (id: string) => { return `${ApiURL.plans}/${id}` };
    static v1PlanDetails = (id: string) => { return `${ApiURL.v1Plans}/${id}` };
    static v1PlanDetailsBenefits = (id: string) => { return `${ApiURL.v1PlanDetails(id)}/benefits` };
    static v1PlanDetailsChannels = (id: string) => { return `${ApiURL.v1PlanDetails(id)}/channels` };
    static v1PlanDetailsDetails = (id: string) => { return `${ApiURL.v1PlanDetails(id)}/details` };
    static v1PlanDetailsDetailsType = (id: string, type: string) => { return `${ApiURL.v1PlanDetailsDetails(id)}/${type}` };
    static v1PlanBulkCreate = `${ApiURL.v1Plans}/bulk-create`;
    static v1PlanBulkCreateDetails = (id: string) => { return `${ApiURL.v1PlanBulkCreate}/${id}` };
    static v1PlanBulkCreateDetailsType = (id: string, type: string) => { return `${ApiURL.v1PlanBulkCreateDetails(id)}/${type}` };
    static v1PlanBenefitBulkCreate = `${ApiURL.v1PlanBenefit}/bulk-create`;
    static v1PlanBenefitCreate = `${ApiURL.v1PlanBenefit}/create`;
    static v1PlanBenefitDetails = (id: string) => { return `${ApiURL.v1PlanBenefit}/${id}` };
    static v1PlanBenefitBulkCreateDetails = (id: string) => { return `${ApiURL.v1PlanBenefitBulkCreate}/${id}` };
    static v1PlanSync = `${ApiURL.v1Plans}/sync`;
    static v1PlanSyncEmbeddedDiscounts = `${ApiURL.v1PlanSync}/embedded-discounts`;

    static billings = "/billings";
    static v1Billings = `/v1${ApiURL.billings}`;
    static billingDetails = (id: string) => { return `${ApiURL.billings}/${id}` };
    static v1BillingDetails = (id: string) => { return `${ApiURL.v1Billings}/${id}` };
    static v1BillingDetailsConfirmReconciliation = (id: string) => { return `${ApiURL.v1BillingDetails(id)}/confirm-reconcilliation` };
    static v1BillingsNotMatchReconciliation = `${ApiURL.v1Billings}/not-match-reconcilliation`;
    static v1BillingsImport = `${ApiURL.v1Billings}/import`;
    static v1BillingsImportTransaction = `${ApiURL.v1BillingsImport}/transactions`;

    static insuredParties = "/insured-parties";
    static v1InsuredParties = `/v1${ApiURL.insuredParties}`;
    static v1InsuredPartiesChannel = `${ApiURL.v1InsuredParties}/channel`;
    static v1InsuredPartiesUploadFirstTime = `${ApiURL.v1InsuredParties}/upload-first-time`;
    static v1InsuredPartiesUploadFirstTimeWithoutTransaction = `${ApiURL.v1InsuredParties}/upload-first-time-without-transaction`;
    static v1InsuredPartiesDetails = (id: string) => { return `${ApiURL.v1InsuredParties}/${id}` };
    static v1InsuredPartiesChannelDetails = (id: string) => { return `${ApiURL.v1InsuredPartiesChannel}/${id}` };
    static masterPolicy = (id: string) => { return `/policies/master/${id}` };
    static endorsement = "/endorsements";
    static v1Endorsement = `/v1${ApiURL.endorsement}`;
    static endorsementUpload = `${ApiURL.endorsement}/bulking`;
    static v1EndorsementUpload = `${ApiURL.v1Endorsement}/bulking`;
    static v1EndorsementDetail = (id: string) => { return `${ApiURL.v1Endorsement}/${id}` };
    static v1EndorsementUpdateStatus = (id: string) => { return `${ApiURL.v1Endorsement}/update-status/${id}` };
    static v1EndorsementUpdtaeStatusBulking = (id: string) => { return `${ApiURL.v1Endorsement}/update-status-bulking/${id}` };
    static updateEndorsementStatus = (id: string) => { return `${ApiURL.endorsement}/update-status-bulking/${id}` };

    static campaign = "/campaign";
    static v1Campaign = `/v1${ApiURL.campaign}`;
    static v1CampaignDetail = (id: string) => { return `${ApiURL.v1Campaign}/${id}` };
    static v1CampaignReport = `${ApiURL.v1Campaign}/report`;
    static v1CampaignDelete = `${ApiURL.v1Campaign}/delete`;
    static v1CampaignDeleteDetails = (id: string) => { return `${ApiURL.v1CampaignDelete}/${id}` };
    static v1CampaignReportInsurance = `${ApiURL.v1CampaignReport}/insurance`;
    static v1CampaignReportExport = `${ApiURL.v1CampaignReport}/export`;
    static v1CampaignReportExportInsurance = `${ApiURL.v1CampaignReportExport}/insurance`;
    static v1CampaignSearch = `${ApiURL.v1Campaign}/search`;
    static v1CampaignSearchQuery = `${ApiURL.v1CampaignSearch}/query`;
    static v1CampaignEmbedded = `${ApiURL.v1Campaign}/embedded`;
    static v1CampaignEmbeddedHistory = `${ApiURL.v1CampaignEmbedded}/history`;
    static v1CampaignEmbeddedHistoryDetails = (id: string) => { return `${ApiURL.v1CampaignEmbeddedHistory}/${id}` };
    static v1CampaignUpdate = `${ApiURL.v1Campaign}/update`;
    static v1CampaignUpdateDetails = (id: string) => { return `${ApiURL.v1CampaignUpdate}/${id}` };

    static fees = "/fees";
    static v1Fees = `/v1${ApiURL.fees}`;
    static v1FeesBroker = `${ApiURL.v1Fees}/broker`;
    static v1FeesBrokerDetail = (id: string) => { return `${ApiURL.v1Fees}/broker/${id}` };
    static v1FeesBrokerFilter = `${ApiURL.v1Fees}/broker-filter`;
    static v1FeesChannel = `${ApiURL.v1Fees}/channel`;
    static v1FeesChannelDetail = (id: string) => { return `${ApiURL.v1Fees}/channel/${id}` };
    static v1FeesChannelFilter = `${ApiURL.v1Fees}/channel-filter`;

    static html2pdf = "/html2pdf";
    static v1Html2pdf = `/v1${ApiURL.html2pdf}`;
    static v1Html2pdfGeneratePdfService = `${ApiURL.v1Html2pdf}/generate-pdf-service`;

    static voucher = "/voucher";
    static v1Voucher = `/v1${ApiURL.voucher}`;
    static v1VoucherDetails = (id: string) => { return `${ApiURL.v1Voucher}/${id}` };
    static v1VoucherCode = (code: string) => { return `/v1${ApiURL.voucher}/code/${code}` };

    static references = "/references";
    static v1References = `/v1${ApiURL.references}`;
    static v1ReferencesType = `${ApiURL.v1References}/type`;
    static v1ReferencesTypeCurrencies = `${ApiURL.v1ReferencesType}/currencies`;

    static blacklist = "/blacklist";
    static v1Blacklist = `/v1${ApiURL.blacklist}`;
    static v1BlacklistUpdate = `${ApiURL.v1Blacklist}/update`;
    static v1BlacklistDelete = `${ApiURL.v1Blacklist}/delete`;
    static v1BlacklistDetails = (id: string) => { return `${ApiURL.v1Blacklist}/${id}` };
    static v1BlacklistUpdateDetails = (id: string) => { return `${ApiURL.v1BlacklistUpdate}/${id}` };
    static v1BlacklistDeleteDetails = (id: string) => { return `${ApiURL.v1BlacklistDelete}/${id}` };

    static sources = "/sources";
    static v1Sources = `/v1${ApiURL.sources}`;
    static v1SourcesPaging = `${ApiURL.v1Sources}/paging`;
    static v1SourcesUpdate = `${ApiURL.v1Sources}/update`;
    static v1SourcesDetails = (id: string) => { return `${ApiURL.v1Sources}/${id}` };
    static v1SourcesUpdateDetails = (id: string) => { return `${ApiURL.v1SourcesUpdate}/${id}` };

    static countries = "/countries";

    static customers = "/customers";
    static v1Customers = `/v1${ApiURL.customers}`;
}

export default ApiURL;
