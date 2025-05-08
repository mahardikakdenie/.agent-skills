"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import logoImg from "/public/images/logo-friendsure-lsh.webp";
import iconHome from "/public/images/icon-home.png";
import iconTransaction from "/public/images/icon-transactions.png";
import iconCampaigns from "/public/images/icon-campaigns.png";
import iconTravel from "/public/images/claim-travel.webp";
import iconPA from "/public/images/claim-pa.webp";
import iconMobil from "/public/images/mobil.webp";
import iconMotor from "/public/images/motor.webp";
import iconPolicy from "/public/images/icon-policy.png";
import iconClaim from "/public/images/icon-claim.png";
import logoAirpaz from "/public/images/logo-airpaz.webp";
import { Menu } from "react-feather";
import { Button } from "./button";
import { usePathname } from "next/navigation";
import { ChartPie } from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const pathname = usePathname();

  const isActive = (sidebar: string) => {
    if (sidebar.endsWith('/*')) {
      const base = sidebar.replace('/*', '');
      return pathname.startsWith(base);
    }
    return pathname === sidebar;
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
                  href="/dashboard/transaction"
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive("/dashboard/transaction/*")
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
                  href="/dashboard/policy"
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive("/dashboard/policy/*")
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
                  href="/dashboard/claim"
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive("/dashboard/claim/*")
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
                  href="/transactions"
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive("/transactions/*")
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
                  href="/billing"
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive("/billing/*")
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
                  href="/broker/broker-fee"
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive("/broker/broker-fee/*")
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
                  href="/broker/partner-com"
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive("/broker/partner-com/*")
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
                  href="/promotion"
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive("/promotion/*")
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
              <li className="mt-2 text-sm">
                <strong>Product Category</strong>
              </li>
              <li>
                <Link
                  href="/product-catalog/travel"
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive("/product-catalog/travel/*")
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <Image
                    src={iconTravel}
                    alt="Travel"
                    className="w-7 min-w-7"
                  />
                  Travel
                </Link>
              </li>
              <li>
                <Link
                  href="/product-catalog/personal-accident"
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive("/product-catalog/personal-accident/*")
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <Image
                    src={iconPA}
                    alt="Personal Accident"
                    className="w-7 min-w-7"
                  />
                  Personal Accident
                </Link>
              </li>
              <li>
                <Link
                  href="/product-catalog/motor-vehicle"
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive("/product-catalog/motor-vehicle/*")
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <Image src={iconMobil} alt="Mobil" className="w-7 min-w-7" />
                  Mobil
                </Link>
              </li>
              <li>
                <Link
                  href="/product-catalog/motor-cycle"
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive("/product-catalog/motor-cycle/*")
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <Image src={iconMotor} alt="Motor" className="w-7 min-w-7" />
                  Motor
                </Link>
              </li>
              <li>
                <Link
                  href="/product-catalog/airpaz"
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive("/product-catalog/airpaz/*")
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <Image
                    src={logoAirpaz}
                    alt="Airpaz"
                    className="w-7 min-w-7"
                  />
                  Airpaz
                </Link>
              </li>
              <li>
                <Link
                  href="/product-catalog/gadget"
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive("/product-catalog/gadget/*")
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <Image src={iconPA} alt="Gadget" className="w-7 min-w-7" />
                  Gadget
                </Link>
              </li>
              <li className="mt-2 text-sm">
                <strong>Policy</strong>
              </li>
              <li>
                <Link
                  href="/policy-list"
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive("/policy-list/*")
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
                  href="/endorsement"
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive("/endorsement/*")
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
                  href="/membership-list"
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive("/membership-list")
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
                  href="/claim-list"
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive("/claim-list/*")
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
                  href="/claim-history"
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive("/claim-history/*")
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
                  href="/masterdata/product-category"
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive("/masterdata/product-category/*")
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
                  href="/masterdata/insurance"
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive("/masterdata/insurance/*")
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
                  href="/masterdata/product"
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive("/masterdata/product/*")
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
                  href="/masterdata/currency"
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive("/masterdata/currency/*")
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
                  href="/masterdata/channels"
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive("/masterdata/channels/*")
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
                  href="/masterdata/user"
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive("/masterdata/user/*")
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
                  href="/masterdata/group"
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive("/masterdata/group/*")
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
                  href="/masterdata/roles"
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive("/masterdata/roles/*")
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
                  href="/masterdata/page-management"
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive("/masterdata/page-management/*")
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
                  href="/masterdata/partner-management"
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive("/masterdata/partner-management/*")
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
                  href="/masterdata/email-template"
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive("/masterdata/email-template/*")
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
                  href="/masterdata/email-tag"
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive("/masterdata/email-tag/*")
                    ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                    : ""
                    }`}
                  onClick={handleMenuClick}
                >
                  <Image src={iconClaim} alt="Page" className="w-7 min-w-7" />
                  Email Tags
                </Link>
              </li>
              <li className="mt-2 text-sm">
                <strong>Sanction List</strong>
              </li>
              <li>
                <Link
                  href="/sanction"
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive("/sanction/*")
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
                  href="/source"
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive("/source/*")
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
                  href="/report/claim"
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive("/report/claim/*")
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
                  href="/report/campaign"
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive("/report/campaign/*")
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
                  href="/report/performance-report"
                  className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${isActive("/report/performance-report/*")
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
