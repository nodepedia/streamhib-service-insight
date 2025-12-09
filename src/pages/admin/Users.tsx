import { useState } from "react";
import { Search, MoreHorizontal, UserPlus, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data
const mockUsers = [
  { id: "1", name: "Ahmad Rizky", email: "ahmad@email.com", role: "user", plan: "professional", streams: 5, created_at: "2024-01-15" },
  { id: "2", name: "Siti Nurhaliza", email: "siti@email.com", role: "user", plan: "starter", streams: 2, created_at: "2024-01-14" },
  { id: "3", name: "Budi Santoso", email: "budi@email.com", role: "admin", plan: "enterprise", streams: 12, created_at: "2024-01-10" },
  { id: "4", name: "Dewi Lestari", email: "dewi@email.com", role: "user", plan: "free", streams: 1, created_at: "2024-01-08" },
  { id: "5", name: "Eko Prasetyo", email: "eko@email.com", role: "user", plan: "professional", streams: 8, created_at: "2024-01-05" },
  { id: "6", name: "Fitri Handayani", email: "fitri@email.com", role: "user", plan: "starter", streams: 3, created_at: "2024-01-03" },
];

const getPlanBadge = (plan: string) => {
  const styles: Record<string, string> = {
    free: "bg-muted text-muted-foreground",
    starter: "bg-blue-500/10 text-blue-500",
    professional: "bg-primary/10 text-primary",
    enterprise: "bg-purple-500/10 text-purple-500",
  };
  return styles[plan] || styles.free;
};

const getRoleBadge = (role: string) => {
  return role === "admin" 
    ? "bg-red-500/10 text-red-500" 
    : "bg-secondary text-secondary-foreground";
};

const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("all");

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = planFilter === "all" || user.plan === planFilter;
    return matchesSearch && matchesPlan;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground mt-1">
            Kelola semua pengguna platform
          </p>
        </div>
        <Button className="bg-gradient-primary text-primary-foreground">
          <UserPlus className="h-4 w-4 mr-2" />
          Tambah User
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari user..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Plan</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="starter">Starter</SelectItem>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Table */}
      <div className="border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead className="text-center">Streams</TableHead>
              <TableHead>Bergabung</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getRoleBadge(user.role)}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getPlanBadge(user.plan)}>
                    {user.plan}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">{user.streams}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString("id-ID")}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                      <DropdownMenuItem>Edit User</DropdownMenuItem>
                      <DropdownMenuItem>Ubah Plan</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        Hapus User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Menampilkan {filteredUsers.length} dari {mockUsers.length} users
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Sebelumnya
          </Button>
          <Button variant="outline" size="sm">
            Selanjutnya
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Users;
