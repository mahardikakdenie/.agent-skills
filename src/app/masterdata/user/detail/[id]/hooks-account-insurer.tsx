"use client";

import { useState } from "react";
import { InsurerService } from "@/services/masterdata/insurer.service";
import { useScreen } from "@/context/screen.context";

export const useAccountInsurer = () => {
  const [accountInsurers, setAccountInsurers] = useState<any[]>([]);
  const [insurers, setInsurers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { setLoading: setGlobalLoading } = useScreen();
  const insurerService = new InsurerService();

  const getAccountInsurers = async (accountId: string) => {
    try {
      setLoading(true);
      const response = await insurerService.getAccountInsurersByAccountId(accountId);
      setAccountInsurers(response.data || []);
    } catch (error) {
      console.error("Error fetching account insurers:", error);
      setAccountInsurers([]);
    } finally {
      setLoading(false);
    }
  };

  const addAccountInsurer = async (data: { account: string; insurance: string; }) => {
    try {
      setGlobalLoading(true);
      const response = await insurerService.addAccountInsurers(data);
      await getAccountInsurers(data.account);
      return response;
    } catch (error) {
      console.error("Error adding account insurer:", error);
      throw error;
    } finally {
      setGlobalLoading(false);
    }
  };

  const removeAccountInsurer = async (accountId: string, insurerId: string) => {
    try {
      setGlobalLoading(true);
      await insurerService.removeAccountInsurers(insurerId);
      await getAccountInsurers(accountId);
    } catch (error) {
      console.error("Error removing account insurer:", error);
      throw error;
    } finally {
      setGlobalLoading(false);
    }
  };



  return {
    accountInsurers,
    insurers,
    loading,
    getAccountInsurers,
    addAccountInsurer,
    removeAccountInsurer,
  };
};
