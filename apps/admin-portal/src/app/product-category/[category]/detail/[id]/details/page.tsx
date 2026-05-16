'use client';

import { useParams } from 'next/navigation';

import { Box } from '@repo/ui';

import { useProducts } from '@/app/product-category/hooks';

export default function PlanDetail() {
  const { id } = useParams();
  const { plan } = useProducts({
    planId: id as string,
  });

  const planName = typeof plan?.name === 'string' ? plan.name : '';
  const planNameLines = planName.split('|').filter(Boolean);

  return (
    <Box className="flex w-full flex-col px-4 py-4 md:px-6 md:py-5">
      <Box className="rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <Box className="flex flex-col gap-2.5">
          <Box as="h2" className="text-sm font-semibold text-slate-950">
            Plan Detail
          </Box>

          {planNameLines.length > 0 && (
            <Box as="h1" className="max-w-2xl text-lg font-bold leading-6 text-primary sm:text-xl">
              {planNameLines.map((item: string, index: number) => (
                <Box key={`${item}-${index}`} as="span" className="block">
                  {item}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
