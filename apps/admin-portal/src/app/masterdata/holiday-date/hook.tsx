import { helperService } from "@/services/helper/api/helper.service";
import { useState } from "react";

const useCalendar = () => {
  const [dataCalendar, setDataCalendar] = useState<any>();

  const getCalendarHoliday = async (
    where?: any,
    page?: number,
    pageSize?: number
  ) => {
    const res = await helperService.getCalendar({
      page,
      pageSize,
      ...(where || {}),
    });
    setDataCalendar(res);
  };

  const createCalendar = async (data: any) => {
    await helperService.createCalendar(data);
  };

  const updateCalendar = async (id: string, data: any) => {
    await helperService.updateCalendar(id, data);
  };

  const deleteCalendar = async (id: string) => {
    await helperService.deleteCalendar(id);
  };

  return {
    dataCalendar,
    getCalendarHoliday,
    createCalendar,
    updateCalendar,
    deleteCalendar,

  };
};

export default useCalendar;
