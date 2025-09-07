// Auth
export const LOGIN = "/";
export const FORBIDDEN = "/forbidden";
export const PROTECTED = "/protected";

// Profile
export const PROFILE = `${PROTECTED}/profile`;
export const CHANGE_PASSWORD = `${PROFILE}/change-password`;

// Dashboard
export const DASHBOARD = `${PROTECTED}/dashboard`;
export const DASHBOARD_TRANSACTION = `${DASHBOARD}/transaction`;
export const DASHBOARD_POLICY = `${DASHBOARD}/policy`;
export const DASHBOARD_CLAIM = `${DASHBOARD}/claim`;

// Billing
export const BILLING = `${PROTECTED}/billing`;
export const UNMATCH_RECON_BILLING = `${PROTECTED}/billing-unmatch-reconcilliation`;
export const BILLING_ADD = `${BILLING}/add`;
export const BILLING_DETAIL = (id: string | number) => `${BILLING}/detail/${id}`;
export const BILLING_DETAIL_INVOICE_WITH_TYPE = (id: string | number, type: string) => `${BILLING_DETAIL(id)}/invoice?type=${type}`;
export const BILLING_DETAIL_EXPORT_WITH_TYPE = (id: string | number, type: string) => `${BILLING_DETAIL(id)}/export?type=${type}`;
export const BILLING_DETAIL_IMPORT_WITH_TYPE = (id: string | number, type: string) => `${BILLING_DETAIL(id)}/import?type=${type}`;

// Broker
export const BROKER = `${PROTECTED}/broker`;
export const BROKER_FEE = `${BROKER}/broker-fee`;
export const BROKER_FEE_ADD = `${BROKER_FEE}/add`;
export const BROKER_FEE_DETAIL = (id: string | number) => `${BROKER_FEE}/edit/${id}`;
export const BROKER_PARTNER_COM = `${BROKER}/partner-com`;
export const BROKER_PARTNER_COM_ADD = `${BROKER_PARTNER_COM}/add`;
export const BROKER_PARTNER_DETAIL = (id: string | number) => `${BROKER_PARTNER_COM}/edit/${id}`;

// Claim List
export const CLAIM_LIST = `${PROTECTED}/claim-list`;
export const CLAIM_LIST_DETAIL = (id: string | number) => `${CLAIM_LIST}/${id}`;
export const CLAIM_LIST_EXPORT = `${CLAIM_LIST}/export`;
export const CLAIM_LIST_IMPORT = `${CLAIM_LIST}/import`;
export const CLAIM_LIST_IMPORT_WITH_PREVIEW = `${CLAIM_LIST}/import-with-preview`;

// Endorsement
export const ENDORSEMENT = `${PROTECTED}/endorsement`;
export const ENDORSEMENT_DETAIL = (id: string | number) => `${ENDORSEMENT}/${id}`;
export const ENDORSEMENT_UPLOAD = `${ENDORSEMENT}/upload`;
export const ENDORSEMENT_EXPORT = `${ENDORSEMENT}/export`;
export const ENDORSEMENT_UPLOAD_WITH_ID = (id: string | number) => `${ENDORSEMENT_DETAIL(id)}/upload`;

// Masterdata
export const MASTERDATA = `${PROTECTED}/masterdata`;

// Masterdata Channels
export const CHANNELS = `${MASTERDATA}/channels`;
export const CHANNELS_DETAIL = (id: string | number) => `${CHANNELS}/${id}`;
export const CHANNELS_ADD = `${CHANNELS}/add`;

// Masterdata Currency
export const CURRENCY = `${MASTERDATA}/currency`;
export const CURRENCY_DETAIL_WITH_INSURANCE_ID = (id: string | number) => `${CURRENCY}/edit?insurance-id=${id}`;
export const CURRENCY_ADD = `${CURRENCY}/add`;

// Masterdata Email Tag
export const EMAIL_TAG = `${MASTERDATA}/email-tag`;
export const EMAIL_TAG_DETAIL = (id: string | number) => `${EMAIL_TAG}/${id}`;
export const EMAIL_TAG_ADD = `${EMAIL_TAG}/add`;

// Masterdata Email Template
export const EMAIL_TEMPLATE = `${MASTERDATA}/email-template`;
export const EMAIL_TEMPLATE_DETAIL = (id: string | number) => `${EMAIL_TEMPLATE}/${id}`;
export const EMAIL_TEMPLATE_ADD = `${EMAIL_TEMPLATE}/add`;
export const EMAIL_TEMPLATE_TAG = `${EMAIL_TEMPLATE}/tag`;
export const EMAIL_TEMPLATE_TAG_ADD = `${EMAIL_TEMPLATE_TAG}/add`;
export const EMAIL_TEMPLATE_TAG_DETAIL = (id: string | number) => `${EMAIL_TEMPLATE_TAG}/edit/${id}`;

// Masterdata Group
export const GROUP = `${MASTERDATA}/group`;
export const GROUP_DETAIL = (id: string | number) => `${GROUP}/${id}`;
export const GROUP_ADD = `${GROUP}/add`;

// Masterdata Holiday
export const HOLIDAY = `${MASTERDATA}/holiday`;
export const HOLIDAY_ADD = `${HOLIDAY}/add`;
export const HOLIDAY_DETAIL = (id: string | number) => `${HOLIDAY}/edit/${id}`;

// Masterdata Insurance
export const INSURANCE = `${MASTERDATA}/insurance`;
export const INSURANCE_DETAIL = (id: string | number) => `${INSURANCE}/${id}`;
export const INSURANCE_ADD = `${INSURANCE}/add`;

// Masterdata Page Management
export const PAGE_MANAGEMENT = `${MASTERDATA}/page-management`;
export const PAGE_MANAGEMENT_DETAIL = (id: string | number) => `${PAGE_MANAGEMENT}/${id}`;
export const PAGE_MANAGEMENT_ADD = `${PAGE_MANAGEMENT}/add`;

// Masterdata Partner Management
export const PARTNER_MANAGEMENT = `${MASTERDATA}/partner-management`;
export const PARTNER_MANAGEMENT_DETAIL = (id: string | number) => `${PARTNER_MANAGEMENT}/${id}/edit`;
export const PARTNER_MANAGEMENT_ADD = `${PARTNER_MANAGEMENT}/add`;

// Masterdata Product
export const PRODUCT = `${MASTERDATA}/product`;
export const PRODUCT_DETAIL_WITH_PARAMS = (categoryId: string | number, insuranceId: string | number) => `${PRODUCT}/edit?category-id=${categoryId}&insurance-id=${insuranceId}`;
export const PRODUCT_ADD = `${PRODUCT}/add`;

// Masterdata Product Category
export const PRODUCT_CATEGORY = `${MASTERDATA}/product-category`;
export const PRODUCT_CATEGORY_DETAIL = (id: string | number) => `${PRODUCT_CATEGORY}/${id}`;
export const PRODUCT_CATEGORY_ADD = `${PRODUCT_CATEGORY}/add`;

// Masterdata Roles
export const ROLES = `${MASTERDATA}/roles`;
export const ROLES_DETAIL = (id: string | number) => `${ROLES}/${id}`;
export const ROLES_ADD = `${ROLES}/add`;

// Masterdata User
export const USER = `${MASTERDATA}/user`;
export const USER_DETAIL = (id: string | number) => `${USER}/${id}`;
export const USER_ADD = `${USER}/add`;

// Masterdata Hospital List
export const HOSPITAL_LIST = `${MASTERDATA}/hospital-list`;
export const HOSPITAL_LIST_UPLOAD = `${HOSPITAL_LIST}/upload`;

// Membership List
export const MEMBERSHIP_LIST = `${PROTECTED}/membership-list`;
export const MEMBERSHIP_LIST_EXPORT = `${MEMBERSHIP_LIST}/export`;
export const MEMBERSHIP_LIST_UPLOAD = `${MEMBERSHIP_LIST}/upload`;
export const MEMBERSHIP_LIST_DETAIL = (id: string | number) => `${MEMBERSHIP_LIST}/${id}`;

// Policy List
export const POLICY_LIST = `${PROTECTED}/policy-list`;
export const POLICY_LIST_DETAIL = (id: string | number) => `${POLICY_LIST}/${id}`;
export const POLICY_LIST_IMPORT = `${POLICY_LIST}/import`;
export const POLICY_LIST_EXPORT = `${POLICY_LIST}/export`;

// Product Catalog
export const PRODUCT_CATALOG = `${PROTECTED}/product-catalog`;
export const PRODUCT_CATALOG_CATEGORY = (category: string | number) => `${PRODUCT_CATALOG}/${category}`;
export const PRODUCT_CATALOG_DETAIL = (category: string | number, id: string | number) => `${PRODUCT_CATALOG_CATEGORY(category)}/${id}`;
export const PRODUCT_CATALOG_ADD = (category: string | number) => `${PRODUCT_CATALOG_CATEGORY(category)}/add`;
export const PRODUCT_CATALOG_UPLOAD = (category: string | number, id: string | number) => `${PRODUCT_CATALOG_DETAIL(category, id)}/upload`;
export const PRODUCT_CATALOG_UPLOAD_BENEFIT = (category: string | number, id: string | number) => `${PRODUCT_CATALOG_DETAIL(category, id)}/upload-benefit`;
export const PRODUCT_CATALOG_UPLOAD_DETAIL = (category: string | number, id: string | number) => `${PRODUCT_CATALOG_DETAIL(category, id)}/upload-detail`;
export const PRODUCT_CATALOG_ADD_PACKAGE = (category: string | number, id: string | number) => `${PRODUCT_CATALOG_DETAIL(category, id)}/add-package`;
export const PRODUCT_CATALOG_EDIT_PACKAGE = (category: string | number, productId: string | number, packageId: string | number) => `${PRODUCT_CATALOG_DETAIL(category, productId)}/edit-package/${packageId}`;
export const PRODUCT_CATALOG_ADD_BENEFIT = (category: string | number, id: string | number) => `${PRODUCT_CATALOG_DETAIL(category, id)}/add-benefit`;
export const PRODUCT_CATALOG_EDIT_BENEFIT = (category: string | number, productId: string | number, packageId: string | number) => `${PRODUCT_CATALOG_DETAIL(category, productId)}/edit-benefit/${packageId}`;

// Promotion
export const PROMOTION = `${PROTECTED}/promotion`;
export const PROMOTION_DETAIL = (id: string | number) => `${PROMOTION}/edit-campaign/${id}`;
export const PROMOTION_ADD = `${PROMOTION}/add-campaign`;

// Export Users
export const EXPORT_USERS = `${PROTECTED}/export-users`;

// Sanction
export const SANCTION = `${PROTECTED}/sanction`;
export const SANCTION_DETAIL = (id: string | number) => `${SANCTION}/edit-sanction/${id}`;
export const SANCTION_ADD = `${SANCTION}/add-sanction`;
export const SANCTION_UPLOAD = `${SANCTION}/upload-sanction`;

// Source
export const SOURCE = `${PROTECTED}/source`;
export const SOURCE_DETAIL = (id: string | number) => `${SOURCE}/edit-source/${id}`;
export const SOURCE_ADD = `${SOURCE}/add-source`;

// Transactions
export const TRANSACTIONS = `${PROTECTED}/transactions`;
export const TRANSACTIONS_EXPORT = `${TRANSACTIONS}/export`;
export const TRANSACTIONS_ADD = `${TRANSACTIONS}/add`;
export const TRANSACTIONS_IMPORT = `${TRANSACTIONS}/import`;

// Claim History
export const CLAIM_HISTORY = `${PROTECTED}/claim-history`;

// Report
export const REPORT = `${PROTECTED}/report`;
export const REPORT_CLAIM = `${REPORT}/claim`;
export const REPORT_CAMPAIGN = `${REPORT}/campaign`;
export const REPORT_ZOHO_CAMPAIGN = `${REPORT}/zoho-campaign`;
export const REPORT_PERFORMANCE = `${REPORT}/performance-report`;