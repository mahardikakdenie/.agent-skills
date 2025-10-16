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
import AppURL from "@/constants/app-url.const";
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
                  href={AppURL.dashboardTransaction}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(AppURL.dashboardTransaction))
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
                  href={AppURL.dashboardPolicy}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(AppURL.dashboardPolicy))
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
                  href={AppURL.dashboardClaim}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(AppURL.dashboardClaim))
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
                  href={AppURL.transactionList}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(AppURL.transactionList))
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
                  href={AppURL.financeBilling}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(AppURL.financeBilling))
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
                  href={AppURL.financeUnmatchBilling}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(AppURL.financeUnmatchBilling))
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
                  href={AppURL.financeBrokerFee}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(AppURL.financeBrokerFee))
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
                  href={AppURL.financePartnerComm}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(AppURL.financePartnerComm))
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
                  href={AppURL.promotionCampaign}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(AppURL.promotionCampaign))
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
                  href={AppURL.policyList}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(AppURL.policyList))
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
                  href={AppURL.endorsementList}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(AppURL.endorsementList))
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
                  href={AppURL.membershipList}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(AppURL.membershipList))
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
                  href={AppURL.claimList}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(AppURL.claimList))
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
                  href={AppURL.claimHistory}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(AppURL.claimHistory))
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
                  href={AppURL.masterdataProductCategory}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(AppURL.masterdataProductCategory))
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
                  href={AppURL.masterdataInsurance}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(AppURL.masterdataInsurance))
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
                  href={AppURL.masterdataProduct}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(AppURL.masterdataProduct))
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
                  href={AppURL.masterdataCurrency}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(AppURL.masterdataCurrency))
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
                  href={AppURL.masterdataChannel}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(AppURL.masterdataChannel))
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
                  href={AppURL.masterdataUser}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(AppURL.masterdataUser))
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
                  href={AppURL.masterdataGroup}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(AppURL.masterdataGroup))
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
                  href={AppURL.masterdataRole}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(AppURL.masterdataRole))
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
                  href={AppURL.masterdataPageManagement}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(AppURL.masterdataPageManagement))
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
                  href={AppURL.masterdataPartnerManagement}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(AppURL.masterdataPartnerManagement))
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
                  href={AppURL.masterdataEmailTemplate}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(AppURL.masterdataEmailTemplate))
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
                  href={AppURL.masterdataEmailTag}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(AppURL.masterdataEmailTag))
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
                  href={AppURL.masterdataHolidayDate}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(AppURL.masterdataHolidayDate))
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
                  href={AppURL.masterdataHospital}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(AppURL.masterdataHospital))
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
                  href={AppURL.sanctionList}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(AppURL.sanctionList))
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
                  href={AppURL.sourceList}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(AppURL.sourceList))
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
                  href={AppURL.reportClaim}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(AppURL.reportClaim))
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
                  href={AppURL.reportCampaign}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(AppURL.reportCampaign))
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
                  href={AppURL.reportPerformance}
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive(withWildcard(AppURL.reportPerformance))
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
