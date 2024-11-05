"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import useRequireAuth from "@/hooks/useRequireAuth";
import { Input } from "@/components/ui/input";
import WithSidebar from "@/hoc/with-sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Trash2,
  X,
} from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useGroup } from "../hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AccountGroup,
  GroupResponse,
  GroupService,
  RoleResponse,
  UserResponse,
} from "@/services/masterdata/group.service";
import Image from "next/image";
import noData from "/public/images/no-data.webp";
import { format } from "date-fns";

const AddGroupPage = ({ params }: { params: { id: string } }) => {
  useRequireAuth();
  const router = useRouter();
  const { id } = params;
  const [updateSuccess, setUpdateSuccess] = useState<boolean | null>(null);
  const path = usePathname();
  const groupService = new GroupService();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenUser, setIsModalOpenUser] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const {
    addGroup,
    fetchGroupById,
    addGroupRole,
    removeGroupRole,
    addGroupAccount,
    removeGroupAccount,
  } = useGroup();
  const [dataRoles, setDataRoles] = useState<any[]>([]);
  const [group, setGroup] = useState<GroupResponse[]>([]);
  const [role, setRole] = useState<RoleResponse[]>([]);
  const [account, setAccount] = useState<UserResponse[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [groupRoles, setGroupRoles] = useState<any[]>([]);
  const [platformFilter, setPlatformFilter] = useState("");
  const [rolesFilter, setRolesFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageRoles, setPageRoles] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalItemsRoles, setTotalItemsRoles] = useState(0);
  const [totalItemsUser, setTotalItemsUser] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowsPerPageRoles, setRowsPerPageRoles] = useState(10);
  const [loading, setLoading] = useState(true);
  const [dataUser, setDataUser] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string[]>([]);
  const [groupUser, setGroupUser] = useState<AccountGroup[]>([]);
  const [userFilter, setUserFilter] = useState("");

  const isAllSelected = selectedRoles.length === dataRoles.length;
  const isAllSelectedUser = selectedUser.length === dataUser.length;

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    shouldUnregister: false,
    defaultValues: {
      id,
      name,
      description,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await addGroup(data, id);
      console.log(response.id);
      if (response.id != null) {
        const id = response.id;
        console.log("berhasil");
        router.push(`/masterdata/group/${id}`);
      }
      console.log("selesai");
    } catch (error) {
      setUpdateSuccess(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const res = await fetchGroupById(id);
          setValue("name", res.data.name);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchData();
  }, [id, setValue]);

  return (
    <div className="flex flex-col w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white md:px-6 p-4 flex items-center">
          <div>
            <Breadcrumb className="sm:block hidden">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink>Masterdata</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    className="cursor-pointer"
                    onClick={() => router.back()}
                  >
                    Group
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Add</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
              Add Group
            </h2>
          </div>

          <div className="flex ml-auto">
            <div
              onClick={() => router.back()}
              className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </div>
            <Button
              type="submit"
              className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-5 rounded-full px-5"
            >
              <Check className="mr-2 w-4 h-4" />
              Save
            </Button>
          </div>
        </div>
        <div className="flex flex-col w-full p-4 md:p-6 gap-4">
          <div className="p-4 sm:p-6 bg-white rounded-lg gap-4">
            <div className="text-primary font-bold mb-5">Group Details</div>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Group Name
              </label>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{
                  required: "Group Name is required",
                }}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="name"
                    placeholder="Insert Category Name"
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value.replace(/\s+/g, "-"))
                    }
                    className={`mt-1 block w-full h-12 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm`}
                  />
                )}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

const AddGroupWithSidebar = (params: any) => WithSidebar(AddGroupPage)(params);
export default AddGroupWithSidebar;
