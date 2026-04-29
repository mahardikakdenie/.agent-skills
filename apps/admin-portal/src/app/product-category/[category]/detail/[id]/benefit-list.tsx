import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Plus, Trash, Upload } from 'react-feather';

import { Box, Button } from '@repo/ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui';

import AppURL from '@/constants/app-url.const';

import { useProducts } from '../../../hooks';

export default function BenefitList(props: { id: string }) {
  const router = useRouter();

  const { id } = props;
  const { category } = useParams();
  const { benefits, deleteBenefit, refetchBenefits, canEdit, canCreate, canDelete } = useProducts({
    planId: id,
    category: category as string,
  });

  useEffect(() => {
    if (id) {
      refetchBenefits();
    }
  }, [id, refetchBenefits]);

  return (
    <Box>
      <Box className="flex justify-end gap-x-4 mb-4">
        <Button
          className="bg-[#F5BA41] hover:bg-[#e6a92d] text-black cursor-pointer"
          disabled={!canEdit}
          onClick={() => router.push(AppURL.productCatalogUploadBenefit(category as string, id))}
        >
          <Upload className="w-5 h-5" /> Upload Benefits
        </Button>
        <Button
          className="bg-[#F5BA41] hover:bg-[#e6a92d] text-black cursor-pointer"
          disabled={!canCreate}
          onClick={() => router.push(AppURL.productCatalogAddBenefit(category as string, id))}
        >
          <Plus className="w-5 h-5" /> Add Benefit
        </Button>
      </Box>
      <Table className="table-search-params">
        <TableHeader>
          <TableRow>
            <TableHead>Benefit</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Value</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {benefits.map((benefit: any) => (
            <TableRow key={benefit.id}>
              <TableCell>{benefit.name}</TableCell>
              <TableCell>{benefit.currency}</TableCell>
              <TableCell>{benefit.value || benefit.html}</TableCell>
              <TableCell className="text-center">
                {benefit.level === 0 && (
                  <Box className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="xs"
                      disabled={!canDelete}
                      onClick={async () => {
                        if (confirm('Are you sure to delete this row?')) {
                          await deleteBenefit(benefit.id);
                        }
                      }}
                      className="h-7 w-7 p-0 rounded-md text-red-600 hover:bg-red-50 hover:!text-red-700"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </Box>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
