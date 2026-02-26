import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import { addUser, updateUser, deleteUser, User } from "@/store/slices/usersSlice";
import { addNotification } from "@/store/slices/notificationsSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Plus, Edit2, Trash2, X, UserCheck, ShieldCheck, GraduationCap } from "lucide-react";

const AdminUsers = () => {
  const users = useAppSelector((s) => s.users.users);
  const dispatch = useAppDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "student" | "trainer">("all");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "student",
    company: "",
    designation: "",
  });

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleEdit = (user: User) => {
    setFormData(user);
    setEditingId(user.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id));
      dispatch(addNotification({ message: "User deleted successfully", type: "info", read: false }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      dispatch(updateUser({ ...formData, id: editingId } as User));
      dispatch(addNotification({ message: "User updated successfully", type: "success", read: false }));
    } else {
      const newUser = {
        ...formData,
        id: `u${Date.now()}`,
        avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${formData.name?.toLowerCase().replace(" ", "")}`,
      } as User;
      dispatch(addUser(newUser));
      dispatch(addNotification({ message: "New user added successfully", type: "success", read: false }));
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", role: "student", company: "", designation: "" });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-accent" /> User Management
          </h2>
          <p className="text-muted-foreground text-sm">Manage access and roles for all users</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-4 shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-info/10 flex items-center justify-center">
            <UserCheck className="h-5 w-5 text-info" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Users</p>
            <p className="text-xl font-bold">{users.length}</p>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Trainers</p>
            <p className="text-xl font-bold">{users.filter(u => u.role === 'trainer').length}</p>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-success" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Students</p>
            <p className="text-xl font-bold">{users.filter(u => u.role === 'student').length}</p>
          </div>
        </div>
      </div>

      {/* Search & Role Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex bg-muted p-1 rounded-lg">
          {(["all", "student", "trainer"] as const).map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${roleFilter === role ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}s
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-foreground">User</th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground">Role</th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground">Organization</th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt="" className="h-10 w-10 rounded-full bg-muted border shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.role === 'trainer' ? 'bg-accent/10 text-accent' : 'bg-success/10 text-success'
                      }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">{user.company || user.designation || "N/A"}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                        <Edit2 className="h-4 w-4 text-info" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 text-card-foreground">
          <div className="bg-card w-full max-w-lg rounded-2xl border shadow-lg overflow-hidden animate-scale-in">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="font-display font-bold text-xl">{editingId ? "Edit User" : "Add User"}</h3>
              <Button variant="ghost" size="icon" onClick={resetForm}><X className="h-5 w-5" /></Button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <Label>Full Name</Label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label>Email Address</Label>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <Label>Role</Label>
                <select
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm mt-1"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                >
                  <option value="student">Student</option>
                  <option value="trainer">Trainer</option>
                </select>
              </div>
              {formData.role === "trainer" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Company</Label>
                    <Input
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="TechCorp"
                    />
                  </div>
                  <div>
                    <Label>Designation</Label>
                    <Input
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      placeholder="Senior Architect"
                    />
                  </div>
                </div>
              )}
              <div className="flex gap-3 pt-4 border-t">
                <Button type="button" variant="outline" className="flex-1" onClick={resetForm}>Cancel</Button>
                <Button type="submit" className="flex-1">
                  {editingId ? "Update User" : "Add User"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
