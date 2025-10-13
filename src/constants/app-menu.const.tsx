import AppURL from "@/constants/app-url.const";
import HamburgerIcon from "@/images/hamburger.icon";
import SecureDoc2Icon from "@/images/secure-doc-2.icon";
import Revenue2Icon from "@/images/revenue-2.icon";
import Home2Icon from "@/images/home-2.icon";
import TaskListIcon from "@/images/task-list.icon";

class AppMenu {
  static menu = [
    {
      name: "Dashboard",
      url: AppURL.dashboard,
      submenu: [
        {
          name: "Transaction",
          url: AppURL.dashboardTransaction,
          icon: Home2Icon("#FFF", "24", "24", "0 -1 20 20"),
          additionalPages: [],
        },
        {
          name: "Policy",
          url: AppURL.dashboardPolicy,
          icon: Home2Icon("#FFF", "24", "24", "0 -1 20 20"),
          additionalPages: [],
        },
        {
          name: "Claim",
          url: AppURL.dashboardClaim,
          icon: Home2Icon("#FFF", "24", "24", "0 -1 20 20"),
          additionalPages: [],
        }
      ]
    },
    {
      name: "Transaction",
      url: AppURL.transaction,
      submenu: [
        {
          name: "Transaction List",
          url: AppURL.transactionList,
          icon: Revenue2Icon("#FFF", "24", "24", "0 0 36 41"),
          additionalPages: [
            {
              name: "Add Transaction",
              url: AppURL.transactionAdd
            },
            {
              name: "Detail Transaction",
              url: AppURL.transactionDetail
            },
            {
              name: "Export Transaction",
              url: AppURL.transactionExport
            },
            {
              name: "Import Transaction",
              url: AppURL.transactionImport
            }
          ]
        }
      ]
    },
    {
      name: "Policy",
      url: AppURL.policy,
      submenu: [
        {
          name: "Policy List",
          url: AppURL.policyList,
          icon: HamburgerIcon("#FFF", "24", "24", "-2 -7 40 40"),
          additionalPages: [
            {
              name: "Detail Policy",
              url: AppURL.policyDetail,
            }
          ]
        },
        {
          name: "Endorsement List",
          url: AppURL.endorsementList,
          icon: TaskListIcon(undefined, undefined, "#FFF", "32", "32", "2 2 28 28"),
          withCircle: false,
          additionalPages: [
            {
              name: "Endorsement Detail",
              url: AppURL.endorsementDetail,
            },
            {
              name: "Endorsement Upload",
              url: AppURL.endorsementUpload,
            }
          ]
        },
      ],
    },
    {
      name: "Claim",
      url: AppURL.claim,
      submenu: [
        {
          name: "Claim List",
          url: AppURL.claimList,
          icon: SecureDoc2Icon("#FFF", "24", "24", "10 8 37 37"),
          additionalPages: [
            {
              name: "Detail Claim",
              url: AppURL.claimDetail,
            }
          ]
        },
        {
          name: "Claim History",
          url: AppURL.claimHistory,
          icon: SecureDoc2Icon("#FFF", "24", "24", "10 8 37 37"),
          additionalPages: []
        }
      ],
    },
    {
      name: "Membership",
      url: AppURL.membership,
      submenu: [
        {
          name: "Membership List",
          url: AppURL.membershipList,
          icon: HamburgerIcon("#FFF", "24", "24", "-2 -7 40 40"),
          additionalPages: [
            {
              name: "Membership Detail",
              url: AppURL.membershipDetail,
            }
          ]
        }
      ]
    },
    {
      name: "Sanction",
      url: AppURL.sanction,
      submenu: [
        {
          name: "Sanction List",
          url: AppURL.sanctionList,
          icon: HamburgerIcon("#FFF", "24", "24", "-2 -7 40 40"),
          additionalPages: [
            {
              name: "Add Sanction",
              url: AppURL.sanctionAdd,
            },
            {
              name: "Sanction Detail",
              url: AppURL.sanctionDetail,
            }
          ]
        }
      ]
    },
    {
      name: "Source",
      url: AppURL.source,
      submenu: [
        {
          name: "Source List",
          url: AppURL.sourceList,
          icon: HamburgerIcon("#FFF", "24", "24", "-2 -7 40 40"),
          additionalPages: [
            {
              name: "Add Source",
              url: AppURL.sourceAdd,
            },
            {
              name: "Source Detail",
              url: AppURL.sourceDetail,
            }
          ]
        }
      ]
    },
    {
      name: "Promotion",
      url: AppURL.promotion,
      submenu: [
        {
          name: "Campaign",
          url: AppURL.promotionCampaign,
          icon: HamburgerIcon("#FFF", "24", "24", "-2 -7 40 40"),
          additionalPages: [
            {
              name: "Add Campaign",
              url: AppURL.promotionCampaignAdd
            },
            {
              name: "Campaign Detail",
              url: AppURL.promotionCampaignEdit
            }
          ]
        }
      ]
    },
    {
      name: "Finance",
      url: AppURL.finance,
      submenu: [
        {
          name: "Billing",
          url: AppURL.financeBilling,
          icon: Revenue2Icon("#FFF", "24", "24", "0 0 36 41"),
          additionalPages: [
            {
              name: "Add Billing",
              url: AppURL.financeBillingAdd
            },
            {
              name: "Detail Billing",
              url: AppURL.financeBillingDetail
            }
          ]
        },
        {
          name: "Unmatch Billing",
          url: AppURL.financeUnmatchBilling,
          icon: Revenue2Icon("#FFF", "24", "24", "0 0 36 41"),
          additionalPages: []
        },
        {
          name: "Broker Fee",
          url: AppURL.financeBrokerFee,
          icon: Revenue2Icon("#FFF", "24", "24", "0 0 36 41"),
          additionalPages: [
            {
              name: "Add Broker Fee",
              url: AppURL.financeBrokerFeeAdd
            },
            {
              name: "Detail Broker Fee",
              url: AppURL.financeBrokerFeeDetail
            }
          ]
        },
        {
          name: "Partner Comm",
          url: AppURL.financePartnerComm,
          icon: Revenue2Icon("#FFF", "24", "24", "0 0 36 41"),
          additionalPages: [
            {
              name: "Add Partner Comm",
              url: AppURL.financePartnerCommAdd
            },
            {
              name: "Detail Partner Comm",
              url: AppURL.financePartnerCommDetail
            }
          ]
        }
      ]
    },
    {
      name: "Masterdata",
      url: AppURL.masterdata,
      submenu: [
        {
          name: "Product Category",
          url: AppURL.masterdataProductCategory,
          icon: Revenue2Icon("#FFF", "24", "24", "0 0 36 41"),
          additionalPages: [
            {
              name: "Add Product Category",
              url: AppURL.masterdataProductCategoryAdd
            },
            {
              name: "Detail Product Category",
              url: AppURL.masterdataProductCategoryDetail
            }
          ]
        },
        {
          name: "Insurance",
          url: AppURL.masterdataInsurance,
          icon: Revenue2Icon("#FFF", "24", "24", "0 0 36 41"),
          additionalPages: [
            {
              name: "Add Insurance",
              url: AppURL.masterdataInsuranceAdd
            },
            {
              name: "Detail Insurance",
              url: AppURL.masterdataInsuranceDetail
            }
          ]
        },
        {
          name: "Product",
          url: AppURL.masterdataProduct,
          icon: Revenue2Icon("#FFF", "24", "24", "0 0 36 41"),
          additionalPages: [
            {
              name: "Add Product",
              url: AppURL.masterdataProductAdd
            },
            {
              name: "Detail Product",
              url: AppURL.masterdataProductDetail
            }
          ]
        },
        {
          name: "Currency",
          url: AppURL.masterdataCurrency,
          icon: Revenue2Icon("#FFF", "24", "24", "0 0 36 41"),
          additionalPages: [
            {
              name: "Add Currency",
              url: AppURL.masterdataCurrencyAdd
            },
            {
              name: "Detail Currency",
              url: AppURL.masterdataCurrencyDetail
            }
          ]
        },
        {
          name: "Channel",
          url: AppURL.masterdataChannel,
          icon: Revenue2Icon("#FFF", "24", "24", "0 0 36 41"),
          additionalPages: [
            {
              name: "Add Channel",
              url: AppURL.masterdataChannelAdd
            },
            {
              name: "Detail Channel",
              url: AppURL.masterdataChannelDetail
            }
          ]
        },
        {
          name: "User",
          url: AppURL.masterdataUser,
          icon: Revenue2Icon("#FFF", "24", "24", "0 0 36 41"),
          additionalPages: [
            {
              name: "Add User",
              url: AppURL.masterdataUserAdd
            },
            {
              name: "Detail User",
              url: AppURL.masterdataUserDetail
            }
          ]
        },
        {
          name: "Group",
          url: AppURL.masterdataGroup,
          icon: Revenue2Icon("#FFF", "24", "24", "0 0 36 41"),
          additionalPages: [
            {
              name: "Add Group",
              url: AppURL.masterdataGroupAdd
            },
            {
              name: "Detail Group",
              url: AppURL.masterdataGroupDetail
            }
          ]
        },
        {
          name: "Role",
          url: AppURL.masterdataRole,
          icon: Revenue2Icon("#FFF", "24", "24", "0 0 36 41"),
          additionalPages: [
            {
              name: "Add Role",
              url: AppURL.masterdataRoleAdd
            },
            {
              name: "Detail Role",
              url: AppURL.masterdataRoleDetail
            }
          ]
        },
        {
          name: "Page Management",
          url: AppURL.masterdataPageManagement,
          icon: Revenue2Icon("#FFF", "24", "24", "0 0 36 41"),
          additionalPages: [
            {
              name: "Add Page Management",
              url: AppURL.masterdataPageManagementAdd
            },
            {
              name: "Detail Page Management",
              url: AppURL.masterdataPageManagementDetail
            }
          ]
        },
        {
          name: "Partner Management",
          url: AppURL.masterdataPartnerManagement,
          icon: Revenue2Icon("#FFF", "24", "24", "0 0 36 41"),
          additionalPages: [
            {
              name: "Add Partner Management",
              url: AppURL.masterdataPartnerManagementAdd
            },
            {
              name: "Detail Partner Management",
              url: AppURL.masterdataPartnerManagementDetail
            }
          ]
        },
        {
          name: "Email Template",
          url: AppURL.masterdataEmailTemplate,
          icon: Revenue2Icon("#FFF", "24", "24", "0 0 36 41"),
          additionalPages: [
            {
              name: "Add Email Template",
              url: AppURL.masterdataEmailTemplateAdd
            },
            {
              name: "Detail Email Template",
              url: AppURL.masterdataEmailTemplateDetail
            }
          ]
        },
        {
          name: "Email Tag",
          url: AppURL.masterdataEmailTag,
          icon: Revenue2Icon("#FFF", "24", "24", "0 0 36 41"),
          additionalPages: [
            {
              name: "Add Email Tag",
              url: AppURL.masterdataEmailTagAdd
            },
            {
              name: "Detail Email Tag",
              url: AppURL.masterdataEmailTagDetail
            }
          ]
        },
        {
          name: "Holiday Date",
          url: AppURL.masterdataHolidayDate,
          icon: Revenue2Icon("#FFF", "24", "24", "0 0 36 41"),
          additionalPages: [
            {
              name: "Add Holiday Date",
              url: AppURL.masterdataHolidayDateAdd
            },
            {
              name: "Detail Holiday Date",
              url: AppURL.masterdataHolidayDateDetail
            }
          ]
        },
        {
          name: "Hospital",
          url: AppURL.masterdataHospital,
          icon: Revenue2Icon("#FFF", "24", "24", "0 0 36 41"),
          additionalPages: []
        }
      ]
    },
    {
      name: "Report",
      url: AppURL.report,
      submenu: [
        {
          name: "Claim Report",
          url: AppURL.reportClaim,
          icon: Revenue2Icon("#FFF", "24", "24", "0 0 36 41"),
          additionalPages: []
        },
        {
          name: "Campaign Report",
          url: AppURL.reportCampaign,
          icon: Revenue2Icon("#FFF", "24", "24", "0 0 36 41"),
          additionalPages: []
        },
        {
          name: "Performance Report",
          url: AppURL.reportPerformance,
          icon: Revenue2Icon("#FFF", "24", "24", "0 0 36 41"),
          additionalPages: []
        }
      ]
    }
  ];
}

export default AppMenu;
