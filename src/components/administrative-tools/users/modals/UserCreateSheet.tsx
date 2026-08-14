import { User } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { UserCreateForm } from "../forms/UserCreateForm";
import { useTranslation } from "react-i18next";

interface UserCreateSheetProps {
  onSuccess?: () => void;
  resetUser?: () => void;
}

export const useUserCreateSheet = ({
  onSuccess,
  resetUser,
}: UserCreateSheetProps = {}) => {
  const { t: tUser } = useTranslation("user-management");
  const {
    SheetFragment: createUserSheet,
    openSheet: openCreateUserSheet,
    closeSheet: closeCreateUserSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <User />
        {tUser("userManagement.sheet.createUserTitle")}
      </div>
    ),
    description: tUser("userManagement.sheet.createUserDescription"),
    children: (
      <UserCreateForm
        className="mx-4"
        onSuccess={() => {
          closeCreateUserSheet();
          onSuccess?.();
        }}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
    onToggle: () => {
      resetUser?.();
    },
  });

  return {
    createUserSheet,
    openCreateUserSheet,
    closeCreateUserSheet,
  };
};
