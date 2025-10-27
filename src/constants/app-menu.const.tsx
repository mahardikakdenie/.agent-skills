import Image, { StaticImageData } from "next/image";
import { ChartPie } from "lucide-react";
import type { ReactNode } from "react";

import AppURL from "@/constants/app-url.const";
import ApiURL from "@/constants/api-url.const";
import { productService } from "@/services/api.service";
import iconTransaction from "/public/images/icon-transactions.png";
import iconCampaigns from "/public/images/icon-campaigns.png";
import iconPolicy from "/public/images/icon-policy.png";
import iconClaim from "/public/images/icon-claim.png";

const renderChartIcon = () => (
  <ChartPie className="text-primary h-[17px] w-[17px]" strokeWidth={3} />
);

const renderImageIcon = (src: StaticImageData, alt: string) => (
  <Image src={src} alt={alt} className="w-7 min-w-7" />
);

const formatCategoryDisplayName = (value: string | undefined) => {
  if (!value) return "";

  return value
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

interface AdditionalPage {
  name: string;
  url: string;
}

interface SubMenuItem {
  name: string;
  url: string;
  icon?: ReactNode;
  withCircle?: boolean;
  additionalPages?: AdditionalPage[];
}

interface MenuItem {
  name: string;
  url: string;
  submenu: SubMenuItem[];
}

interface ProductCategory {
  id: string;
  name: string;
  icon?: string;
  display_name?: string;
  [key: string]: unknown;
}

class AppMenu {
  private static readonly productCategoryMenuName = "Product Category";
  private static hasLoadedProductCategories = false;
  private static loadingProductCategories: Promise<void> | null = null;

  static menu: MenuItem[] = [
    {
      name: "Dashboard",
      url: AppURL.dashboard,
      submenu: [
        {
          name: "Transaction",
          url: AppURL.dashboardTransaction,
          icon: renderChartIcon(),
          additionalPages: [],
        },
        {
          name: "Policy",
          url: AppURL.dashboardPolicy,
          icon: renderChartIcon(),
          additionalPages: [],
        },
        {
          name: "Claim",
          url: AppURL.dashboardClaim,
          icon: renderChartIcon(),
          additionalPages: [],
        },
      ],
    },
    {
      name: "Transaction",
      url: AppURL.transaction,
      submenu: [
        {
          name: "Transaction List",
          url: AppURL.transactionList,
          icon: renderImageIcon(iconTransaction, "Transaction List"),
          additionalPages: [
            {
              name: "Add Transaction",
              url: AppURL.transactionAdd,
            },
            {
              name: "Detail Transaction",
              url: AppURL.transactionDetail,
            },
            {
              name: "Export Transaction",
              url: AppURL.transactionExport,
            },
            {
              name: "Import Transaction",
              url: AppURL.transactionImport,
            },
          ],
        },
      ],
    },
    {
      name: "Policy",
      url: AppURL.policy,
      submenu: [
        {
          name: "Policy List",
          url: AppURL.policyList,
          icon: renderImageIcon(iconPolicy, "Policy List"),
          additionalPages: [
            {
              name: "Detail Policy",
              url: AppURL.policyDetail,
            },
          ],
        },
        {
          name: "Endorsement List",
          url: AppURL.endorsementList,
          icon: renderImageIcon(iconClaim, "Endorsement List"),
          withCircle: false,
          additionalPages: [
            {
              name: "Endorsement Detail",
              url: AppURL.endorsementDetail,
            },
            {
              name: "Endorsement Upload",
              url: AppURL.endorsementUpload,
            },
          ],
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
          icon: renderImageIcon(iconClaim, "Claim List"),
          additionalPages: [
            {
              name: "Detail Claim",
              url: AppURL.claimDetail,
            },
          ],
        },
        {
          name: "Claim History",
          url: AppURL.claimHistory,
          icon: renderImageIcon(iconClaim, "Claim History"),
          additionalPages: [],
        },
      ],
    },
    {
      name: "Membership",
      url: AppURL.membership,
      submenu: [
        {
          name: "Membership List",
          url: AppURL.membershipList,
          icon: renderImageIcon(iconClaim, "Membership List"),
          additionalPages: [
            {
              name: "Membership Detail",
              url: AppURL.membershipDetail,
            },
          ],
        },
      ],
    },
    {
      name: "Sanction",
      url: AppURL.sanction,
      submenu: [
        {
          name: "Sanction List",
          url: AppURL.sanctionList,
          icon: renderImageIcon(iconClaim, "Sanction List"),
          additionalPages: [
            {
              name: "Add Sanction",
              url: AppURL.sanctionAdd,
            },
            {
              name: "Sanction Detail",
              url: AppURL.sanctionDetail,
            },
          ],
        },
      ],
    },
    {
      name: "Source",
      url: AppURL.source,
      submenu: [
        {
          name: "Source List",
          url: AppURL.sourceList,
          icon: renderImageIcon(iconClaim, "Source List"),
          additionalPages: [
            {
              name: "Add Source",
              url: AppURL.sourceAdd,
            },
            {
              name: "Source Detail",
              url: AppURL.sourceDetail,
            },
          ],
        },
      ],
    },
    {
      name: "Promotion",
      url: AppURL.promotion,
      submenu: [
        {
          name: "Campaign",
          url: AppURL.promotionCampaign,
          icon: renderImageIcon(iconCampaigns, "Campaign"),
          additionalPages: [
            {
              name: "Add Campaign",
              url: AppURL.promotionCampaignAdd,
            },
            {
              name: "Campaign Detail",
              url: AppURL.promotionCampaignEdit,
            },
          ],
        },
        {
          name: "Export Users",
          url: AppURL.exportUsers,
          icon: renderImageIcon(iconTransaction, "Export Users"),
        },
      ],
    },
    {
      name: "Product",
      url: "",
      submenu: [
        {
          name: "Product Catalog",
          url: AppURL.productCategory,
          icon: renderImageIcon(iconClaim, "Product Catalog"),
          additionalPages: [],
        },
      ],
    },
    {
      name: "Finance",
      url: AppURL.finance,
      submenu: [
        {
          name: "Billing",
          url: AppURL.financeBilling,
          icon: renderImageIcon(iconClaim, "Billing"),
          additionalPages: [
            {
              name: "Add Billing",
              url: AppURL.financeBillingAdd,
            },
            {
              name: "Detail Billing",
              url: AppURL.financeBillingDetail,
            },
          ],
        },
        {
          name: "Unmatch Billing",
          url: AppURL.financeUnmatchBilling,
          icon: renderImageIcon(iconClaim, "Unmatch Billing"),
          additionalPages: [],
        },
        {
          name: "Broker Fee",
          url: AppURL.financeBrokerFee,
          icon: renderImageIcon(iconClaim, "Broker Fee"),
          additionalPages: [
            {
              name: "Add Broker Fee",
              url: AppURL.financeBrokerFeeAdd,
            },
            {
              name: "Detail Broker Fee",
              url: AppURL.financeBrokerFeeDetail,
            },
          ],
        },
        {
          name: "Partner Comm",
          url: AppURL.financePartnerComm,
          icon: renderImageIcon(iconClaim, "Partner Comm"),
          additionalPages: [
            {
              name: "Add Partner Comm",
              url: AppURL.financePartnerCommAdd,
            },
            {
              name: "Detail Partner Comm",
              url: AppURL.financePartnerCommDetail,
            },
          ],
        },
      ],
    },
    {
      name: "Masterdata",
      url: AppURL.masterdata,
      submenu: [
        {
          name: "Product Category",
          url: AppURL.masterdataProductCategory,
          icon: renderImageIcon(iconClaim, "Product Category"),
          additionalPages: [
            {
              name: "Add Product Category",
              url: AppURL.masterdataProductCategoryAdd,
            },
            {
              name: "Detail Product Category",
              url: AppURL.masterdataProductCategoryDetail,
            },
          ],
        },
        {
          name: "Insurance",
          url: AppURL.masterdataInsurance,
          icon: renderImageIcon(iconClaim, "Insurance"),
          additionalPages: [
            {
              name: "Add Insurance",
              url: AppURL.masterdataInsuranceAdd,
            },
            {
              name: "Detail Insurance",
              url: AppURL.masterdataInsuranceDetail,
            },
          ],
        },
        {
          name: "Product",
          url: AppURL.masterdataProduct,
          icon: renderImageIcon(iconClaim, "Product"),
          additionalPages: [
            {
              name: "Add Product",
              url: AppURL.masterdataProductAdd,
            },
            {
              name: "Detail Product",
              url: AppURL.masterdataProductDetail,
            },
          ],
        },
        {
          name: "Currency",
          url: AppURL.masterdataCurrency,
          icon: renderImageIcon(iconClaim, "Currency"),
          additionalPages: [
            {
              name: "Add Currency",
              url: AppURL.masterdataCurrencyAdd,
            },
            {
              name: "Detail Currency",
              url: AppURL.masterdataCurrencyDetail,
            },
          ],
        },
        {
          name: "Channel",
          url: AppURL.masterdataChannel,
          icon: renderImageIcon(iconClaim, "Channel"),
          additionalPages: [
            {
              name: "Add Channel",
              url: AppURL.masterdataChannelAdd,
            },
            {
              name: "Detail Channel",
              url: AppURL.masterdataChannelDetail,
            },
          ],
        },
        {
          name: "User",
          url: AppURL.masterdataUser,
          icon: renderImageIcon(iconClaim, "User"),
          additionalPages: [
            {
              name: "Add User",
              url: AppURL.masterdataUserAdd,
            },
            {
              name: "Detail User",
              url: AppURL.masterdataUserDetail,
            },
          ],
        },
        {
          name: "Group",
          url: AppURL.masterdataGroup,
          icon: renderImageIcon(iconClaim, "Group"),
          additionalPages: [
            {
              name: "Add Group",
              url: AppURL.masterdataGroupAdd,
            },
            {
              name: "Detail Group",
              url: AppURL.masterdataGroupDetail,
            },
          ],
        },
        {
          name: "Role",
          url: AppURL.masterdataRole,
          icon: renderImageIcon(iconClaim, "Role"),
          additionalPages: [
            {
              name: "Add Role",
              url: AppURL.masterdataRoleAdd,
            },
            {
              name: "Detail Role",
              url: AppURL.masterdataRoleDetail,
            },
          ],
        },
        {
          name: "Page Management",
          url: AppURL.masterdataPageManagement,
          icon: renderImageIcon(iconClaim, "Page Management"),
          additionalPages: [
            {
              name: "Add Page Management",
              url: AppURL.masterdataPageManagementAdd,
            },
            {
              name: "Detail Page Management",
              url: AppURL.masterdataPageManagementDetail,
            },
          ],
        },
        {
          name: "Partner Management",
          url: AppURL.masterdataPartnerManagement,
          icon: renderImageIcon(iconClaim, "Partner Management"),
          additionalPages: [
            {
              name: "Add Partner Management",
              url: AppURL.masterdataPartnerManagementAdd,
            },
            {
              name: "Detail Partner Management",
              url: AppURL.masterdataPartnerManagementDetail,
            },
          ],
        },
        {
          name: "Email Template",
          url: AppURL.masterdataEmailTemplate,
          icon: renderImageIcon(iconClaim, "Email Template"),
          additionalPages: [
            {
              name: "Add Email Template",
              url: AppURL.masterdataEmailTemplateAdd,
            },
            {
              name: "Detail Email Template",
              url: AppURL.masterdataEmailTemplateDetail,
            },
          ],
        },
        {
          name: "Email Tag",
          url: AppURL.masterdataEmailTag,
          icon: renderImageIcon(iconClaim, "Email Tag"),
          additionalPages: [
            {
              name: "Add Email Tag",
              url: AppURL.masterdataEmailTagAdd,
            },
            {
              name: "Detail Email Tag",
              url: AppURL.masterdataEmailTagDetail,
            },
          ],
        },
        {
          name: "Holiday Date",
          url: AppURL.masterdataHolidayDate,
          icon: renderImageIcon(iconClaim, "Holiday Date"),
          additionalPages: [
            {
              name: "Add Holiday Date",
              url: AppURL.masterdataHolidayDateAdd,
            },
            {
              name: "Detail Holiday Date",
              url: AppURL.masterdataHolidayDateDetail,
            },
          ],
        },
        {
          name: "Hospital",
          url: AppURL.masterdataHospital,
          icon: renderImageIcon(iconClaim, "Hospital"),
          additionalPages: [],
        },
      ],
    },
    {
      name: "Report",
      url: AppURL.report,
      submenu: [
        {
          name: "Claim Report",
          url: AppURL.reportClaim,
          icon: renderImageIcon(iconClaim, "Claim Report"),
          additionalPages: [],
        },
        {
          name: "Campaign Report",
          url: AppURL.reportCampaign,
          icon: renderImageIcon(iconClaim, "Campaign Report"),
          additionalPages: [],
        },
        {
          name: "Performance Report",
          url: AppURL.reportPerformance,
          icon: renderImageIcon(iconClaim, "Performance Report"),
          additionalPages: [],
        },
      ],
    },
  ];

  static async loadProductCategories(force = false): Promise<void> {
    if (AppMenu.hasLoadedProductCategories && !force) return;
    if (AppMenu.loadingProductCategories && !force) {
      return AppMenu.loadingProductCategories;
    }

    AppMenu.loadingProductCategories = (async () => {
      try {
        const response: any = await productService.get(ApiURL.v1Categories, {
          params: { limit: 1000 },
        });
        const rawCategories =
          response?.data?.data ?? response?.data ?? response ?? [];
        const normalizedCategories = Array.isArray(rawCategories)
          ? rawCategories
          : [];
        // AppMenu.applyProductCategories(normalizedCategories);
        AppMenu.hasLoadedProductCategories = true;
      } catch (error) {
        console.error("[AppMenu] Failed to load product categories:", error);
      } finally {
        AppMenu.loadingProductCategories = null;
      }
    })();

    return AppMenu.loadingProductCategories;
  }

  private static applyProductCategories(categories: ProductCategory[]) {
    const productCategoryMenu = AppMenu.menu.find(
      (item) => item.name === AppMenu.productCategoryMenuName
    );

    if (!productCategoryMenu) return;

    productCategoryMenu.submenu = categories.map((category) =>
      AppMenu.mapCategoryToSubmenu(category)
    );
  }

  private static mapCategoryToSubmenu(category: ProductCategory): SubMenuItem {
    const displayName =
      category.display_name || formatCategoryDisplayName(category.name);
    const baseUrl = AppURL.productCatalogCategory(category.name);
    const detailBaseUrl = `${baseUrl}/detail/`;

    return {
      name: displayName,
      url: baseUrl,
      icon: AppMenu.renderProductCategoryIcon(category.icon, displayName),
      additionalPages: [
        {
          name: "Add Plan",
          url: AppURL.productCatalogAdd(category.name),
        },
        {
          name: "Detail Product Catalog",
          url: detailBaseUrl,
        },
      ],
    };
  }

  private static renderProductCategoryIcon(
    icon: string | undefined,
    alt: string
  ): ReactNode {
    if (!icon) {
      return renderImageIcon(iconClaim, alt);
    }

    return (
      <Image
        src={icon}
        alt={alt}
        width={28}
        height={28}
        className="w-7 min-w-7"
      />
    );
  }
}

export default AppMenu;
