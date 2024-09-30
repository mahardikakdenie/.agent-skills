"use client";
import { useState } from "react";
import Image from "next/image";

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

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div
        className={`sidebar relative h-screen bg-white ${
          isOpen ? "min-w-72 w-72" : "min-w-0 w-0"
        }`}
      >
        <Button
          className="absolute left-full top-0 z-10 h-[63px] p-0 min-w-unit-16 px-4 border-0 bg-transparent rounded-none ms-1"
          onClick={toggleSidebar}
        >
          <Menu className="text-white" />
        </Button>
        <div className="w-full overflow-auto h-full flex flex-col items-center pb-5">
          <div className="w-64">
            <Image
              src={logoImg}
              alt="Logo"
              className="w-56 mx-auto mt-2 mb-4"
            />
            <ul className="text-black flex flex-col gap-4">
              <li className="text-sm">
                <strong>Dashboard</strong>
              </li>
              <li>
                <a
                  href="/home"
                  className="hover:text-[#006EA7] flex text-sm items-center gap-2"
                >
                  <Image src={iconHome} alt="Home" className="w-7 min-w-7" />
                  Home
                </a>
              </li>
              <li className="mt-2 text-sm">
                <strong>Transactions</strong>
              </li>
              <li>
                <a
                  href="/transactions"
                  className="hover:text-[#006EA7] flex text-sm items-center gap-2"
                >
                  <Image
                    src={iconTransaction}
                    alt="Transactions List"
                    className="w-7 min-w-7"
                  />
                  Transactions List
                </a>
              </li>
              <li className="mt-2 text-sm">
                <strong>Promotions</strong>
              </li>
              <li>
                <a
                  href="/promotion"
                  className="hover:text-[#006EA7] flex text-sm items-center gap-2"
                >
                  <Image
                    src={iconCampaigns}
                    alt="Campaigns"
                    className="w-7 min-w-7"
                  />
                  Campaigns
                </a>
              </li>
              <li className="mt-2 text-sm">
                <strong>Product Category</strong>
              </li>
              <li>
                <a
                  href="/product-catalog/travel"
                  className="hover:text-[#006EA7] flex text-sm items-center gap-2"
                >
                  <Image
                    src={iconTravel}
                    alt="Travel"
                    className="w-7 min-w-7"
                  />
                  Travel
                </a>
              </li>
              <li>
                <a
                  href="/product-catalog/personal-accident"
                  className="hover:text-[#006EA7] flex text-sm items-center gap-2"
                >
                  <Image
                    src={iconPA}
                    alt="Personal Accident"
                    className="w-7 min-w-7"
                  />
                  Personal Accident
                </a>
              </li>
              <li>
                <a
                  href="/product-catalog/mobil"
                  className="hover:text-[#006EA7] flex text-sm items-center gap-2"
                >
                  <Image src={iconMobil} alt="Mobil" className="w-7 min-w-7" />
                  Mobil
                </a>
              </li>
              <li>
                <a
                  href="/product-catalog/motor"
                  className="hover:text-[#006EA7] flex text-sm items-center gap-2"
                >
                  <Image src={iconMotor} alt="Motor" className="w-7 min-w-7" />
                  Motor
                </a>
              </li>
              <li>
                <a
                  href="/product-catalog/airpaz"
                  className="hover:text-[#006EA7] flex text-sm items-center gap-2"
                >
                  <Image
                    src={logoAirpaz}
                    alt="Airpaz"
                    className="w-7 min-w-7"
                  />
                  Airpaz
                </a>
              </li>
              <li className="mt-2 text-sm">
                <strong>Policy</strong>
              </li>
              <li>
                <a
                  href="/policy-list"
                  className="hover:text-[#006EA7] flex text-sm items-center gap-2"
                >
                  <Image
                    src={iconPolicy}
                    alt="Policy List"
                    className="w-7 min-w-7"
                  />
                  Policy List
                </a>
              </li>
              <li className="mt-2 text-sm">
                <strong>Claim</strong>
              </li>
              <li>
                <a
                  href="/claim-list"
                  className="hover:text-[#006EA7] flex text-sm items-center gap-2"
                >
                  <Image
                    src={iconClaim}
                    alt="Claim List"
                    className="w-7 min-w-7"
                  />
                  Claim List
                </a>
              </li>
              <li className="mt-2 text-sm">
                <strong>Masterdata</strong>
              </li>
              <li>
                <a
                  href="/masterdata/product-category"
                  className="hover:text-[#006EA7] flex text-sm items-center gap-2"
                >
                  <Image
                    src={iconClaim}
                    alt="Product Category"
                    className="w-7 min-w-7"
                  />
                  Product Category
                </a>
              </li>
              <li>
                <a
                  href="/masterdata/insurance-and-product"
                  className="hover:text-[#006EA7] flex text-sm items-center gap-2"
                >
                  <Image
                    src={iconClaim}
                    alt="Insurance and Product"
                    className="w-7 min-w-7"
                  />
                  Insurance and Product
                </a>
              </li>
              <li>
                <a
                  href="/masterdata/user"
                  className="hover:text-[#006EA7] flex text-sm items-center gap-2"
                >
                  <Image src={iconClaim} alt="User" className="w-7 min-w-7" />
                  User
                </a>
              </li>
              <li>
                <a
                  href="/masterdata/roles"
                  className="hover:text-[#006EA7] flex text-sm items-center gap-2"
                >
                  <Image src={iconClaim} alt="Roles" className="w-7 min-w-7" />
                  Roles
                </a>
              </li>
              <li>
                <a
                  href="/masterdata/currency"
                  className="hover:text-[#006EA7] flex text-sm items-center gap-2"
                >
                  <Image
                    src={iconClaim}
                    alt="Currency"
                    className="w-7 min-w-7"
                  />
                  Currency
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
