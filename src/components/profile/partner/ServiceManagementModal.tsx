import { useState, useEffect } from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { AlertCircle } from "lucide-react";

import CommonPopup from "@/components/common/CommonPopup";
import { Button } from "@/components/ui/button";
import { updateServices } from "@/api/partnerProfile";
import { myBookingsServicesAPI } from "@/api/adminBookingManagement";
import axiosInstance from "@/helper/axiosInstance";
import { FloatingLabelMultiSelect } from "@/components/ui/select";
import { useAdminDetail } from "@/context/AdminDetailContext";

interface ITreeItem {
  id: number;
  name: string;
}

interface ICategory extends ITreeItem {
  subcategories?: ITreeItem[];
}

interface IServiceType extends ITreeItem {
  categories?: ICategory[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  initialData: {
    servicetypes: ITreeItem[];
    categories: ITreeItem[];
    subcategories: ITreeItem[];
  };
  onSuccess: (data: {
    servicetypes: ITreeItem[];
    categories: ITreeItem[];
    subcategories: ITreeItem[];
  }) => void;
}

const ServiceManagementModal = ({
  open,
  onClose,
  initialData,
  onSuccess,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [hasPendingBookings, setHasPendingBookings] = useState(false);
  const [serviceTypesList, setServiceTypesList] = useState<IServiceType[]>([]);
  const [categoriesList, setCategoriesList] = useState<ICategory[]>([]);
  const [subcategoriesList, setSubcategoriesList] = useState<ITreeItem[]>([]);
  const { profileDetail} = useAdminDetail();

  const [allCategoriesMap, setAllCategoriesMap] = useState<
    Map<number, ITreeItem>
  >(new Map());
  const [allSubcategoriesMap, setAllSubcategoriesMap] = useState<
    Map<number, ITreeItem>
  >(new Map());

  // Initialize maps from initialData to ensure immediate display of names
  useEffect(() => {
    if (open) {
      setAllCategoriesMap((prev) => {
        const next = new Map(prev);
        initialData.categories.forEach((c) => next.set(c.id, c));
        return next;
      });
      setAllSubcategoriesMap((prev) => {
        const next = new Map(prev);
        initialData.subcategories.forEach((s) => next.set(s.id, s));
        return next;
      });

      // Also pre-populate the display lists with current selections so they show up even during fetch
      setCategoriesList(initialData.categories as ICategory[]);
      setSubcategoriesList(initialData.subcategories);
    }
  }, [open, initialData.categories, initialData.subcategories]);

  const fetchMetadata = async () => {
    try {
      setFetching(true);
      const res = await axiosInstance.get("service-types");

      if (res.data?.data) {
        setServiceTypesList(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch metadata", err);
      toast.error("Failed to load service options.");
    } finally {
      setFetching(false);
    }
  };

  const checkPendingBookings = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      if (!userInfo.id) return;

      const response = await myBookingsServicesAPI({
        userId: Number(userInfo.id),
        tab: "UPCOMING",
        page: 1,
        limit: 1,
      });

      if (response.success && response.data?.bookings?.length > 0) {
        setHasPendingBookings(true);
      } else {
        setHasPendingBookings(false);
      }
    } catch (err) {
      console.error("Failed to check pending bookings", err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchMetadata();
      checkPendingBookings();
      formik.resetForm();
    }
  }, [open]);

  const formik = useFormik({
    initialValues: {
      servicetypes: initialData.servicetypes.map((s) => s.id) || [],
      categories: initialData.categories.map((c) => c.id) || [],
      subcategories: initialData.subcategories.map((s) => s.id) || [],
    },
    enableReinitialize: true,
    onSubmit: async (values, { setErrors }) => {
      if (hasPendingBookings) {
        toast.error("Cannot update services while you have pending bookings.");
        return;
      }

      try {
        setLoading(true);
        const response = await updateServices({
          servicetypes: values.servicetypes.map(String),
          categories: values.categories.map(String),
          subcategories: values.subcategories.map(String),
        }, profileDetail?.role || "");

        if (response.data?.success) {
          toast.success("Professional services updated successfully.");

          const updatedServiceTypes = serviceTypesList.filter((st) =>
            values.servicetypes.includes(st.id)
          );
          const updatedCategories = values.categories
            .map((id) => allCategoriesMap.get(id))
            .filter(Boolean) as ITreeItem[];
          const updatedSubcategories = values.subcategories
            .map((id) => allSubcategoriesMap.get(id))
            .filter(Boolean) as ITreeItem[];

          onSuccess({
            servicetypes:
              updatedServiceTypes.length > 0
                ? updatedServiceTypes
                : initialData.servicetypes.filter((s) =>
                    values.servicetypes.includes(s.id)
                  ),
            categories: updatedCategories,
            subcategories: updatedSubcategories,
          });
          onClose();
        }
      } catch (err: any) {
        console.error(err);
        const errorData = err.response?.data;
        if (errorData?.errors) {
          const formattedErrors: any = {};
          Object.keys(errorData.errors).forEach((key) => {
            if (Array.isArray(errorData.errors[key])) {
              formattedErrors[key] = errorData.errors[key][0];
            } else {
              formattedErrors[key] = errorData.errors[key];
            }
          });
          setErrors(formattedErrors);
        }
      } finally {
        setLoading(false);
      }
    },
  });

  // Fetch categories when service types change
  useEffect(() => {
    const fetchSelectedCategories = async () => {
      if (formik.values.servicetypes.length === 0) {
        setCategoriesList([]);
        return;
      }

      try {
        const promises = formik.values.servicetypes.map((id) =>
          axiosInstance.get(`service-types/${id}/categories`)
        );
        const results = await Promise.all(promises);
        const allCats = results.flatMap((r) => r.data.data || []);

        const uniqueCats = Array.from(
          new Map(allCats.map((c) => [c.id, c])).values()
        );
        setCategoriesList(uniqueCats);

        setAllCategoriesMap((prev) => {
          const next = new Map(prev);
          uniqueCats.forEach((c) => next.set(c.id, { id: c.id, name: c.name }));
          return next;
        });
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    if (open) {
      fetchSelectedCategories();
    }
  }, [formik.values.servicetypes, open]);

  // Handle cascading deletion for Categories
  useEffect(() => {
    // Only filter if we have categoriesList and it's not the initial mount of the list
    if (categoriesList.length > 0 || formik.values.servicetypes.length === 0) {
      const validCategoryIds = categoriesList.map((c) => c.id);
      const filteredCategories = formik.values.categories.filter((id) =>
        validCategoryIds.includes(id)
      );

      if (filteredCategories.length !== formik.values.categories.length) {
        formik.setFieldValue("categories", filteredCategories);
      }
    }
  }, [categoriesList]);

  // Derive subcategories from selected categories
  useEffect(() => {
    const subs = categoriesList
      .filter((cat) => formik.values.categories.includes(cat.id))
      .flatMap((cat) => cat.subcategories || []);

    if (subs.length > 0) {
      const uniqueSubs = Array.from(
        new Map(subs.map((s) => [s.id, s])).values()
      );
      setSubcategoriesList(uniqueSubs);

      setAllSubcategoriesMap((prev) => {
        const next = new Map(prev);
        uniqueSubs.forEach((s) => next.set(s.id, { id: s.id, name: s.name }));
        return next;
      });
    } else {
      setSubcategoriesList([]);
    }
  }, [formik.values.categories, categoriesList]);

  // Handle cascading deletion for Subcategories
  useEffect(() => {
    // Only filter if we have a way to know what's valid
    if (subcategoriesList.length > 0 || formik.values.categories.length === 0) {
      const validSubIds = subcategoriesList.map((s) => s.id);
      const filteredSubs = formik.values.subcategories.filter((id) =>
        validSubIds.includes(id)
      );

      if (filteredSubs.length !== formik.values.subcategories.length) {
        formik.setFieldValue("subcategories", filteredSubs);
      }
    }
  }, [subcategoriesList]);

  return (
    <CommonPopup
      className="max-w-xl w-full"
      open={open}
      onOpenChange={onClose}
      title="Manage Professional Services"
      loading={loading || (fetching && serviceTypesList.length === 0)}
      onCancel={onClose}
      footer={
        <div className="flex w-full gap-4">
          <Button
            variant="secondary"
            className="flex-1 rounded-full"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 rounded-full"
            onClick={() => formik.handleSubmit()}
            disabled={
              loading ||
              (fetching && serviceTypesList.length === 0) ||
              hasPendingBookings ||
              formik.values.servicetypes.length === 0 ||
              formik.values.categories.length === 0 ||
              formik.values.subcategories.length === 0
            }
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      }
    >
      <div className="space-y-6 py-4 px-1">
        {hasPendingBookings && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-red-800">
                Pending Actions Required
              </p>
              <p className="text-xs text-red-700 leading-relaxed">
                Please complete or cancel your previous booking services first.
                You cannot update your professional services while you have
                active jobs.
              </p>
            </div>
          </div>
        )}

        <div
          className={hasPendingBookings ? "opacity-60 pointer-events-none" : ""}
        >
          <div className="space-y-8">
            <FloatingLabelMultiSelect
              id="servicetypes"
              label="Service Types"
              maxCount={3}
              options={
                serviceTypesList.length > 0
                  ? serviceTypesList.map((st) => ({
                      value: st.id,
                      label: st.name,
                    }))
                  : initialData.servicetypes.map((s) => ({
                      value: s.id,
                      label: s.name,
                    }))
              }
              value={formik.values.servicetypes}
              onChange={(val) => {
                formik.setFieldValue("servicetypes", val);
              }}
              placeholder=" "
              error={formik.errors.servicetypes as string}
            />

            <FloatingLabelMultiSelect
              id="categories"
              label="Categories"
              maxCount={3}
              options={categoriesList.map((cat) => ({
                value: cat.id,
                label: cat.name,
              }))}
              value={formik.values.categories}
              onChange={(val) => {
                formik.setFieldValue("categories", val);
              }}
              className={
                formik.values.servicetypes.length === 0
                  ? "opacity-60 pointer-events-none"
                  : ""
              }
              placeholder=" "
              error={formik.errors.categories as string}
            />

            <FloatingLabelMultiSelect
              id="subcategories"
              label="Sub-Services / Expertise"
              maxCount={3}
              options={subcategoriesList.map((sub) => ({
                value: sub.id,
                label: sub.name,
              }))}
              value={formik.values.subcategories}
              onChange={(val) => {
                formik.setFieldValue("subcategories", val);
              }}
              className={
                formik.values.categories.length === 0
                  ? "opacity-60 pointer-events-none"
                  : ""
              }
              placeholder=" "
              error={formik.errors.subcategories as string}
            />
          </div>
        </div>
      </div>
    </CommonPopup>
  );
};

export default ServiceManagementModal;
