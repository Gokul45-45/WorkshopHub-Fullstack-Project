import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import { addCourse, updateCourse, deleteCourse, Course } from "@/store/slices/coursesSlice";
import { addNotification } from "@/store/slices/notificationsSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen, Plus, Search, Edit2, Trash2, X, Check,
  MoreVertical, Filter, Download
} from "lucide-react";

const categories = ["AI & ML", "Cloud Computing", "DevOps", "Data Science", "React Development", "Cyber Security", "Other"];

const AdminCourses = () => {
  const courses = useAppSelector((s) => s.courses.courses);
  const dispatch = useAppDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Course>>({
    title: "",
    category: categories[0],
    price: 0,
    duration: "",
    modules: 0,
    description: "",
    status: "active",
  });

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (course: Course) => {
    setFormData(course);
    setEditingId(course.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      dispatch(deleteCourse(id));
      dispatch(addNotification({ message: "Course deleted successfully", type: "info", read: false }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      dispatch(updateCourse({ ...formData, id: editingId } as Course));
      dispatch(addNotification({ message: "Course updated successfully", type: "success", read: false }));
    } else {
      const newCourse = {
        ...formData,
        id: `c${Date.now()}`,
        trainerId: "t1", // Default to a mock trainer
        rating: 0,
        enrolled: 0,
        learnings: [],
        requirements: [],
      } as Course;
      dispatch(addCourse(newCourse));
      dispatch(addNotification({ message: "New course added successfully", type: "success", read: false }));
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: categories[0],
      price: 0,
      duration: "",
      modules: 0,
      description: "",
      status: "active",
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-accent" /> Course Management
          </h2>
          <p className="text-muted-foreground text-sm">Monitor and manage all courses on the platform</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Course
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Courses</p>
          <p className="text-2xl font-bold text-card-foreground">{courses.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Active Courses</p>
          <p className="text-2xl font-bold text-success">{courses.filter(c => c.status === 'active').length}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Revenue (Est.)</p>
          <p className="text-2xl font-bold text-accent">₹{courses.reduce((acc, c) => acc + (c.price * c.enrolled), 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" /> Filter
        </Button>
      </div>

      {/* CRUD Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-foreground">Course</th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground text-center">Enrolled</th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground">Price</th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-foreground">{course.title}</p>
                      <p className="text-xs text-muted-foreground">{course.category} • {course.duration}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium">{course.enrolled}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">₹{course.price}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${course.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                      }`}>
                      {course.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(course)}>
                        <Edit2 className="h-4 w-4 text-info" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(course.id)}>
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

      {/* Form Modal (Simplified) */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-lg rounded-2xl border shadow-lg overflow-hidden animate-scale-in">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="font-display font-bold text-xl">{editingId ? "Edit Course" : "Add Course"}</h3>
              <Button variant="ghost" size="icon" onClick={resetForm}><X className="h-5 w-5" /></Button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <Label>Title</Label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Course Title"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <select
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Price (₹)</Label>
                  <Input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Duration</Label>
                  <Input
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 40 hours"
                  />
                </div>
                <div>
                  <Label>Modules</Label>
                  <Input
                    type="number"
                    required
                    value={formData.modules}
                    onChange={(e) => setFormData({ ...formData, modules: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="h-24"
                />
              </div>
              <div>
                <Label>Status</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.status === 'active'}
                      onChange={() => setFormData({ ...formData, status: 'active' })}
                    />
                    <span className="text-sm">Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.status === 'inactive'}
                      onChange={() => setFormData({ ...formData, status: 'inactive' })}
                    />
                    <span className="text-sm">Inactive</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <Button type="button" variant="outline" className="flex-1" onClick={resetForm}>Cancel</Button>
                <Button type="submit" className="flex-1">
                  {editingId ? "Update Course" : "Add Course"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;
