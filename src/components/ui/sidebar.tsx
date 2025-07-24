"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import logoImg from "/public/images/logo-friendsure-lsh.webp";
import iconTransaction from "/public/images/icon-transactions.png";
import iconCampaigns from "/public/images/icon-campaigns.png";
import iconPolicy from "/public/images/icon-policy.png";
import iconClaim from "/public/images/icon-claim.png";
import { Menu } from "react-feather";
import { Button } from "./button";
import { usePathname } from "next/navigation";
import { ChartPie } from "lucide-react";
import {
  BILLING,
  BROKER_FEE,
  BROKER_PARTNER_COM,
  CHANNELS,
  CLAIM_HISTORY,
  CLAIM_LIST,
  CURRENCY,
  DASHBOARD_CLAIM,
  DASHBOARD_POLICY,
  DASHBOARD_TRANSACTION,
  EMAIL_TAG,
  EMAIL_TEMPLATE,
  ENDORSEMENT,
  GROUP,
  HOLIDAY,
  HOSPITAL_LIST,
  INSURANCE,
  MEMBERSHIP_LIST,
  PAGE_MANAGEMENT,
  PARTNER_MANAGEMENT,
  POLICY_LIST,
  PRODUCT,
  PRODUCT_CATALOG_CATEGORY,
  PRODUCT_CATEGORY,
  PROMOTION,
  REPORT_CAMPAIGN,
  REPORT_CLAIM,
  REPORT_PERFORMANCE,
  ROLES,
  SANCTION,
  SOURCE,
  TRANSACTIONS,
  UNMATCH_RECON_BILLING,
  USER,
} from "@/constants/routes";
import { withWildcard } from "@/helpers/route.helper";
import ProductCategorySidebar from "../sidebar/product-category.sidebar";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const pathname = usePathname();

  const isActive = (sidebar: string) => {
    const cleanSidebar = sidebar.replace('/*', '');
    return pathname === cleanSidebar || pathname.startsWith(cleanSidebar + '/');
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuClick = () => {
    if (window.innerWidth <= 1199) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1199) {
        setIsOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div
        className={`sidebar relative z-30 h-screen bg-white ${isOpen ? "sm:min-w-72 sm:w-72 min-w-64 w-64" : "min-w-0 w-0"
          }`}
      >
        <Button
          className="absolute left-full top-0 z-10 h-[63px] p-0 min-w-unit-16 px-4 border-0 bg-transparent focus:bg-transparent rounded-none ms-1"
          onClick={toggleSidebar}
        >
          <Menu className="text-white" />
        </Button>
        <div className="w-full overflow-auto h-full flex flex-col items-center pb-5">
          <div className="sm:w-64 w-56">
            <Image
              src={logoImg}
              alt="Logo"
              className="xl:w-56 w-48 mx-auto mt-2 mb-4"
            />
            <ul className="text-black flex flex-col gap-2">
              <li className="text-sm">
                <strong>Dashboard</strong>
              </li>
              <li>
                <Link
                  href={DASHBOARD_TRANSACTION}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(DASHBOARD_TRANSACTION))
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <ChartPie className="text-primary h-[17px] w-[17px] ml-[6px] mr-[5px] my-[5px]" strokeWidth={3} />
                  Transaction
                </Link>
              </li>
              <li>
                <Link
                  href={DASHBOARD_POLICY}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(DASHBOARD_POLICY))
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <ChartPie className="text-primary h-[17px] w-[17px] ml-[6px] mr-[5px] my-[5px]" strokeWidth={3} />
                  Policy
                </Link>
              </li>
              <li>
                <Link
                  href={DASHBOARD_CLAIM}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(DASHBOARD_CLAIM))
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <ChartPie className="text-primary h-[17px] w-[17px] ml-[6px] mr-[5px] my-[5px]" strokeWidth={3} />
                  Claim
                </Link>
              </li>
              <li className="mt-2 text-sm">
                <strong>Transactions</strong>
              </li>
              <li>
                <Link
                  href={TRANSACTIONS}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(TRANSACTIONS))
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <Image
                    src={iconTransaction}
                    alt="Transactions List"
                    className="w-7 min-w-7"
                  />
                  Transactions List
                </Link>
              </li>
              <li className="mt-2 text-sm">
                <strong>Finance</strong>
              </li>
              <li>
                <Link
                  href={BILLING}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(BILLING))
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <Image
                    src={iconClaim}
                    alt="Billing"
                    className="w-7 min-w-7"
                  />
                  Billing
                </Link>
              </li>
              <li>
                <Link
                  href={UNMATCH_RECON_BILLING}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(UNMATCH_RECON_BILLING))
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <Image
                    src={iconClaim}
                    alt="Unmatched Billing"
                    className="w-7 min-w-7"
                  />
                  Unmatch Billing
                </Link>
              </li>
              <li>
                <Link
                  href={BROKER_FEE}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(BROKER_FEE))
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <Image
                    src={iconClaim}
                    alt="Broker Fee"
                    className="w-7 min-w-7"
                  />
                  Broker Fee
                </Link>
              </li>
              <li>
                <Link
                  href={BROKER_PARTNER_COM}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(BROKER_PARTNER_COM))
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <Image
                    src={iconClaim}
                    alt="Partner Comm"
                    className="w-7 min-w-7"
                  />
                  Partner Comm
                </Link>
              </li>
              <li className="mt-2 text-sm">
                <strong>Promotions</strong>
              </li>
              <li>
                <Link
                  href={PROMOTION}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(PROMOTION))
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <Image
                    src={iconCampaigns}
                    alt="Campaigns"
                    className="w-7 min-w-7"
                  />
                  Campaigns
                </Link>
              </li>
              <ProductCategorySidebar isActive={isActive} handleMenuClick={handleMenuClick} />
              <li className="mt-2 text-sm">
                <strong>Policy</strong>
              </li>
              <li>
                <Link
                  href={POLICY_LIST}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(POLICY_LIST))
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <Image
                    src={iconPolicy}
                    alt="Policy List"
                    className="w-7 min-w-7"
                  />
                  Policy List
                </Link>
              </li>
              <li>
                <Link
                  href={ENDORSEMENT}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(ENDORSEMENT))
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <Image
                    src={iconClaim}
                    alt="Endorsement"
                    className="w-7 min-w-7"
                  />
                  Endorsement
                </Link>
              </li>
              <li className="mt-2 text-sm">
                <strong>Membership</strong>
              </li>
              <li>
                <Link
                  href={MEMBERSHIP_LIST}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(MEMBERSHIP_LIST))
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <Image
                    src={iconClaim}
                    alt="Membership List"
                    className="w-7 min-w-7"
                  />
                  Membership List
                </Link>
              </li>
              <li className="mt-2 text-sm">
                <strong>Claim</strong>
              </li>
              <li>
                <Link
                  href={CLAIM_LIST}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(CLAIM_LIST))
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <Image
                    src={iconClaim}
                    alt="Claim List"
                    className="w-7 min-w-7"
                  />
                  Claim List
                </Link>
              </li>
              <li>
                <Link
                  href={CLAIM_HISTORY}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(CLAIM_HISTORY))
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <Image
                    src={iconClaim}
                    alt="Claim History"
                    className="w-7 min-w-7"
                  />
                  Claim History
                </Link>
              </li>
              <li className="mt-2 text-sm">
                <strong>Masterdata</strong>
              </li>
              <li>
                <Link
                  href={PRODUCT_CATEGORY}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(PRODUCT_CATEGORY))
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <Image
                    src={iconClaim}
                    alt="Product Category"
                    className="w-7 min-w-7"
                  />
                  Product Category
                </Link>
              </li>
              <li>
                <Link
                  href={INSURANCE}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(INSURANCE))
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <Image
                    src={iconClaim}
                    alt="Insurance"
                    className="w-7 min-w-7"
                  />
                  Insurance
                </Link>
              </li>
              <li>
                <Link
                  href={PRODUCT}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(PRODUCT))
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <Image
                    src={iconClaim}
                    alt="Product"
                    className="w-7 min-w-7"
                  />
                  Product
                </Link>
              </li>
              <li>
                <Link
                  href={CURRENCY}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(CURRENCY))
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <Image
                    src={iconClaim}
                    alt="Currency"
                    className="w-7 min-w-7"
                  />
                  Currency
                </Link>
              </li>
              <li>
                <Link
                  href={CHANNELS}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(CHANNELS))
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <Image src={iconClaim} alt="User" className="w-7 min-w-7" />
                  Channels
                </Link>
              </li>
              <li>
                <Link
                  href={USER}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(USER))
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <Image src={iconClaim} alt="User" className="w-7 min-w-7" />
                  User
                </Link>
              </li>
              <li>
                <Link
                  href={GROUP}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(GROUP))
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <Image src={iconClaim} alt="Group" className="w-7 min-w-7" />
                  Group
                </Link>
              </li>
              <li>
                <Link
                  href={ROLES}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(ROLES))
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <Image src={iconClaim} alt="Roles" className="w-7 min-w-7" />
                  Roles
                </Link>
              </li>
              <li>
                <Link
                  href={PAGE_MANAGEMENT}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(PAGE_MANAGEMENT))
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <Image src={iconClaim} alt="Page" className="w-7 min-w-7" />
                  Page Management
                </Link>
              </li>
              <li>
                <Link
                  href={PARTNER_MANAGEMENT}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(PARTNER_MANAGEMENT))
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <Image src={iconClaim} alt="Page" className="w-7 min-w-7" />
                  Partner Management
                </Link>
              </li>
              <li>
                <Link
                  href={EMAIL_TEMPLATE}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(EMAIL_TEMPLATE))
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <Image src={iconClaim} alt="Page" className="w-7 min-w-7" />
                  Email Template
                </Link>
              </li>
              <li>
                <Link
                  href={EMAIL_TAG}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(EMAIL_TAG))
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <Image src={iconClaim} alt="Page" className="w-7 min-w-7" />
                  Email Tags
                </Link>
              </li>
              <li>
                <Link
                  href={HOLIDAY}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(HOLIDAY))
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <Image src={iconClaim} alt="Page" className="w-7 min-w-7" />
                  Holiday Date
                </Link>
              </li>
              <li>
                <Link
                  href={HOSPITAL_LIST}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive("/masterdata/hospital-list")
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <Image src={iconClaim} alt="Page" className="w-7 min-w-7" />
                  Hospital List
                </Link>
              </li>
              <li className="mt-2 text-sm">
                <strong>Sanction List</strong>
              </li>
              <li>
                <Link
                  href={SANCTION}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(SANCTION))
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <Image
                    src={iconClaim}
                    alt="Sanction List"
                    className="w-7 min-w-7"
                  />
                  Sanction List
                </Link>
                <Link
                  href={SOURCE}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(SOURCE))
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <Image
                    src={iconClaim}
                    alt="Source List"
                    className="w-7 min-w-7"
                  />
                  Source List
                </Link>
              </li>
              <li className="mt-2 text-sm">
                <strong>Report</strong>
              </li>
              <li>
                <Link
                  href={REPORT_CLAIM}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(REPORT_CLAIM))
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <Image
                    src={iconClaim}
                    alt="Claim Report"
                    className="w-7 min-w-7"
                  />
                  Claim Report
                </Link>
              </li>
              <li>
                <Link
                  href={REPORT_CAMPAIGN}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(REPORT_CAMPAIGN))
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <Image
                    src={iconClaim}
                    alt="Campaign Report"
                    className="w-7 min-w-7"
                  />
                  Campaign Report
                </Link>
              </li>
              <li>
                <Link
                  href={REPORT_PERFORMANCE}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(REPORT_PERFORMANCE))
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <Image
                    src={iconClaim}
                    alt="Performance Report"
                    className="w-7 min-w-7"
                  />
                  Performance Report
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="overlay" onClick={toggleSidebar}></div>
      </div>
    </>
  );
};

export default Sidebar;
