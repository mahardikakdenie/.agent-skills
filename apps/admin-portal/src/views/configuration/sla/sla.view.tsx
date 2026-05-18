import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { Box } from '@repo/ui';

import NotFound from '@/components/not-found';
import { useAuth } from '@/context/auth.context';
import { useScreen } from '@/context/screen.context';
import { getHeaderPage } from '@/helpers/app.helper';
import { channelService } from '@/services/channel/api/channel.service';

export const ConfigurationSlaView = () => {
  const [data, setData] = useState<any[]>([]);
  const path = usePathname();
  const { handleResponseError, user } = useAuth();
  const { isMobileView, setLoading } = useScreen();
  const channelId = user?.channel;

  useEffect(() => {
    fetchConfigurationSla().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchConfigurationSla = async () => {
    try {
      setLoading(true);
      const response: any = await channelService.getChannelConfigurations({ channel: channelId });
      if (response) {
        const configurations = Array.isArray(response) ? response : response?.data || [];
        setData(configurations?.[0]?.sla || []);
      }
    } catch (error: any) {
      handleResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="mx-auto py-5 px-7">
      <Box className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-5">
        <Box as="p" className={`font-bold text-lg ${isMobileView && 'mb-2'}`}>
          {getHeaderPage(2, path, true).pageName}
        </Box>
      </Box>
      {data.length > 0 ? (
        <Box className="relative bg-white rounded-md shadow-md">
          <Box className="overflow-x-auto sm:scrollable">
            <Box as="table" className="min-w-full divide-y divide-gray-200">
              <Box as="thead" className="bg-white">
                <Box as="tr">
                  <Box
                    as="th"
                    className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    No.
                  </Box>
                  <Box
                    as="th"
                    className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    From
                  </Box>
                  <Box
                    as="th"
                    className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    To
                  </Box>
                  <Box
                    as="th"
                    className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Period
                  </Box>
                </Box>
              </Box>
              <Box as="tbody" className="bg-white divide-y divide-gray-200">
                {data.map((d, index) => (
                  <Box as="tr" key={`${index}-${d.id}`} className="hover:bg-gray-50">
                    <Box as="td" className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </Box>
                    <Box as="td" className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {d.status_from || '-'}
                    </Box>
                    <Box as="td" className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {!!d.status_to && d.status_to.length > 0 ? d.status_to.join(', ') : '-'}
                    </Box>
                    <Box as="td" className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {d.period || '-'}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box className="flex items-center justify-center bg-white rounded-md py-20 shadow">
          <NotFound
            width={isMobileView && '143'}
            height={isMobileView && '144'}
            size1={isMobileView && '143'}
            size3={isMobileView && '95'}
            viewBox={isMobileView && '0 0 70 70'}
            text="No sla data available"
            textClassName={isMobileView && 'text-xs'}
          />
        </Box>
      )}
    </Box>
  );
};
