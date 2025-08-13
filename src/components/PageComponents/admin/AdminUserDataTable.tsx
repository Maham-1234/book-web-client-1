import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import type { User } from "@/types";

interface AdminUserDataTableProps {
  users: User[];
  isLoading: boolean;
  updateUserAsAdmin: (
    userId: string,
    data: { isActive?: boolean }
  ) => Promise<void>;
}

export default function AdminUserDataTable({
  users,
  isLoading,
  updateUserAsAdmin,
}: AdminUserDataTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60 rounded-lg border-2 border-dashed">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-lg border-2 border-dashed">
        <h3 className="text-lg font-semibold">No Users Found</h3>
        <p className="text-sm text-muted-foreground mt-1">
          There are no registered users to display.
        </p>
      </div>
    );
  }

  const handleDisableToggle = async (user: User) => {
    // Toggle isActive (soft delete)
    try {
      await updateUserAsAdmin(user.id, { isActive: !user.isActive });
    } catch (err) {
      // handle error as needed (toast, alert, etc.)
      console.error("Failed to update user status:", err);
    }
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {`${user.firstName} ${user.lastName}`}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge
                  variant={user.role === "admin" ? "default" : "secondary"}
                >
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={user.isActive ? "default" : "destructive"}>
                  {user.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {user.provider.charAt(0).toUpperCase() +
                    user.provider.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant={user.isActive ? "destructive" : "default"}
                  size="sm"
                  onClick={() => handleDisableToggle(user)}
                >
                  {user.isActive ? "Disable" : "Enable"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
