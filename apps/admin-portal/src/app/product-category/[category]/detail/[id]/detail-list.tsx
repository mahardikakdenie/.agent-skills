import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Upload } from 'react-feather';

import { Box, Button } from '@repo/ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui';

import AppURL from '@/constants/app-url.const';

import { useProducts } from '../../../hooks';

export default function DetailList(props: { id: string }) {
  const { id } = props;
  const { category } = useParams();
  const [type, setType] = useState('tnc');
  const { getPlanDetails, details, canEdit } = useProducts({
    planId: id,
  });
  useEffect(() => {
    (async () => await getPlanDetails(type))();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const path = usePathname();
  const router = useRouter();
  const handleTypeChange = (value: string) => {
    setType(value);
  };
  return (
    <Box>
      <Box className="flex justify-end gap-x-4 mb-4">
        <Button
          className="bg-[#F5BA41] hover:bg-[#e6a92d] text-black cursor-pointer"
          disabled={!canEdit}
          onClick={() => router.push(AppURL.productCatalogUploadDetail(category as string, id))}
        >
          <Upload className="w-5 h-5" />
          Upload Details
        </Button>
      </Box>
      <Select value={type} onValueChange={handleTypeChange}>
        <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2 mb-5">
          <SelectValue content="Detail Type" />
          <SelectContent>
            <SelectGroup>
              <SelectItem value="tnc">Terms and Conditions</SelectItem>
              <SelectItem value="how-to-claim">Cara Klaim</SelectItem>
              <SelectItem value="exception">Pengecualian</SelectItem>
              <SelectItem value="persentase">Persentase</SelectItem>
            </SelectGroup>
          </SelectContent>
        </SelectTrigger>
      </Select>
      <Table className="table-search-params">
        <TableHeader>
          <TableRow>
            <TableHead>Detail</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {details.map((detail: any) => (
            <TableRow key={detail.id}>
              <TableCell>{detail.detail}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
