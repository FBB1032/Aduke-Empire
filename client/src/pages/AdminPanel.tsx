import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit2, Plus } from "lucide-react";

type ProductForm = {
  name: string;
  price: number;
  image?: File;
  category: "abaya" | "scarf" | "jallabiya";
  color?: string;
  length?: number;
  isBestSeller: boolean;
};

function ProductFormComponent({ editingProduct, onSuccess }: { editingProduct?: any; onSuccess?: () => void }) {
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProductForm>({
    defaultValues: {
      name: "",
      price: 0,
      category: "abaya",
      color: "",
      isBestSeller: false,
    },
  });

  useEffect(() => {
    if (editingProduct) {
      form.reset({
        name: editingProduct.name,
        price: editingProduct.price,
        category: editingProduct.category,
        color: editingProduct.color || "",
        length: editingProduct.length,
        isBestSeller: editingProduct.isBestSeller || false,
      });
      if (editingProduct.imageId) {
        setImagePreview(`/api/images/${editingProduct.imageId}`);
      }
    }
  }, [editingProduct, form]);

  const handleSubmit = async (data: ProductForm) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price.toString());
      formData.append("category", data.category);
      if (data.image) formData.append("image", data.image);
      if (data.color) formData.append("color", data.color);
      if (data.length) formData.append("length", data.length.toString());
      formData.append("isBestSeller", data.isBestSeller.toString());

      const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products";
      const method = editingProduct ? "PATCH" : "POST";

      const res = await fetch(url, { method, body: formData, credentials: "include" });
      if (!res.ok) throw new Error("Save failed");

      alert(editingProduct ? "Product updated successfully!" : "Product created successfully!");
      form.reset();
      setImagePreview(undefined);
      onSuccess?.();
    } catch (error) {
      alert("Error: " + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full bg-background border border-secondary/20 shadow-lg rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-secondary/20 py-6">
        <div className="flex items-center gap-3">
          {editingProduct ? <Edit2 className="w-6 h-6 text-primary" /> : <Plus className="w-6 h-6 text-primary" />}
          <CardTitle className="text-primary text-2xl font-light">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80 font-medium text-sm">Product Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Elegant Black Abaya" {...field} className="border-secondary/30 bg-secondary/5 focus:border-primary/50 focus:bg-white rounded-xl h-11 transition-colors" required />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80 font-medium text-sm">Price (Naira ₦) *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" step="1" {...field} onChange={(e) => field.onChange(Number(e.target.value))} className="border-secondary/30 bg-secondary/5 focus:border-primary/50 focus:bg-white rounded-xl h-11 transition-colors" required />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80 font-medium text-sm">Category *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="border-secondary/30 bg-secondary/5 focus:border-primary/50 focus:bg-white rounded-xl h-11 transition-colors">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="abaya">Abaya</SelectItem>
                        <SelectItem value="scarf">Scarf</SelectItem>
                        <SelectItem value="jallabiya">Jallabiya</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80 font-medium text-sm">Color (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Black, Navy, White" {...field} className="border-secondary/30 bg-secondary/5 focus:border-primary/50 focus:bg-white rounded-xl h-11 transition-colors" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/80 font-medium text-sm">Length (cm - Optional)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 140" {...field} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} className="border-secondary/30 bg-secondary/5 focus:border-primary/50 focus:bg-white rounded-xl h-11 transition-colors" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange } }) => (
                <FormItem>
                  <FormLabel className="text-foreground/80 font-medium text-sm">Product Image {!editingProduct && "*"}</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <div className="relative border-2 border-dashed border-secondary/30 rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              onChange(file);
                              setImagePreview(URL.createObjectURL(file));
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="text-center pointer-events-none">
                          <div className="text-4xl mb-2">📸</div>
                          <p className="text-sm text-foreground/60">Drag & drop your image here or click to browse</p>
                        </div>
                      </div>
                      {imagePreview && (
                        <div className="relative">
                          <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-xl border border-secondary/20 shadow-md" />
                          <p className="text-xs text-foreground/50 mt-2">✓ Image selected</p>
                        </div>
                      )}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isBestSeller"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} className="w-5 h-5" />
                  </FormControl>
                  <FormLabel className="text-foreground/80 font-medium text-sm !m-0 cursor-pointer">Mark as Best Seller ⭐</FormLabel>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold text-base h-12 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {isSubmitting ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function AdminPanel() {
  const [, setLocation] = useLocation();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/check", { credentials: "include" });
      const data = await res.json();
      
      if (data.authenticated) {
        setIsAuth(true);
        loadProducts();
      } else {
        setIsAuth(false);
        setLocation("/admin-login");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setIsAuth(false);
      setLocation("/admin-login");
    } finally {
      setIsLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await fetch("/api/products?limit=100", { credentials: "include" });
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error("Load products error:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE", credentials: "include" });
      loadProducts();
    } catch (error) {
      alert("Failed to delete product");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setLocation("/admin-login");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-foreground/70 text-lg font-light">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <p className="text-foreground/70 text-lg font-light">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="font-brand text-5xl lg:text-6xl text-primary drop-shadow-sm">
              Admin Panel
            </h1>
            <div className="w-24 h-1 bg-primary/20 rounded-full"></div>
            <p className="text-foreground/60 text-lg font-light mt-4">Manage your product inventory and catalog</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="border-primary/30 text-primary hover:bg-primary hover:text-white rounded-full px-8 h-11 font-medium transition-all duration-300">
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <ProductFormComponent editingProduct={editingProduct} onSuccess={() => { loadProducts(); setEditingProduct(null); }} />
          </div>

          {/* Products List Section */}
          <div>
            <Card className="bg-background border border-secondary/20 shadow-lg rounded-2xl overflow-hidden sticky top-24">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-secondary/20 py-6">
                <CardTitle className="text-primary text-xl font-light flex items-center gap-2">
                  <span className="text-2xl">📦</span> Products ({products.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {products.length === 0 ? (
                    <div className="text-center py-12 space-y-3">
                      <p className="text-4xl">📭</p>
                      <p className="text-foreground/50 font-light">No products yet</p>
                      <p className="text-xs text-foreground/40">Add your first product using the form</p>
                    </div>
                  ) : (
                    products.map((p) => (
                      <div key={p.id} className="p-4 border border-secondary/15 rounded-xl bg-gradient-to-br from-secondary/5 to-transparent hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 group">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-medium text-foreground text-sm line-clamp-2 flex-1">{p.name}</p>
                            {p.isBestSeller && <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full whitespace-nowrap">⭐ Best</span>}
                          </div>
                          <p className="text-xs text-foreground/60 capitalize">{p.category}</p>
                          <p className="text-sm font-semibold text-primary">₦{p.price.toLocaleString()}</p>
                          <div className="flex gap-2 mt-3 pt-2 border-t border-secondary/10">
                            <Button
                              onClick={() => setEditingProduct(p)}
                              size="sm"
                              variant="outline"
                              className="flex-1 border-primary/30 text-primary hover:bg-primary hover:text-white rounded-lg font-medium transition-all duration-300 text-xs"
                            >
                              <Edit2 className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDelete(p.id)}
                              size="sm"
                              className="flex-1 bg-destructive/20 text-destructive hover:bg-destructive hover:text-white rounded-lg font-medium transition-all duration-300 text-xs"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
