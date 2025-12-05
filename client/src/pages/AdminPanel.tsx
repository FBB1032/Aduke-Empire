import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProductForm = {
  name: string;
  price: number;
  image?: File;
  category: "abaya" | "scarf" | "jallabiya";
  color?: string;
  length?: number;
  isBestSeller: boolean;
};

function ProductForm({ editingProduct, onSuccess }: { editingProduct?: any; onSuccess?: () => void }) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = form.getValues();
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

      alert(editingProduct ? "Product updated!" : "Product created!");
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
    <Card className="w-full bg-background border border-secondary/20 shadow-sm rounded-lg">
      <CardHeader className="border-b border-secondary/10 bg-secondary/5">
        <CardTitle className="text-primary text-2xl font-light">
          {editingProduct ? "Edit Product" : "Add New Product"}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormItem>
            <FormLabel className="text-foreground/70 font-medium text-sm">Product Name *</FormLabel>
            <Input
              placeholder="Enter product name"
              value={form.getValues("name")}
              onChange={(e) => form.setValue("name", e.target.value)}
              className="border-secondary/20 focus:border-primary/50 rounded-lg h-10"
              required
            />
          </FormItem>

          <FormItem>
            <FormLabel className="text-foreground/70 font-medium text-sm">Price (AED) *</FormLabel>
            <Input
              type="number"
              placeholder="0"
              step="0.01"
              value={form.getValues("price")}
              onChange={(e) => form.setValue("price", Number(e.target.value))}
              className="border-secondary/20 focus:border-primary/50 rounded-lg h-10"
              required
            />
          </FormItem>

          <FormItem>
            <FormLabel className="text-foreground/70 font-medium text-sm">Category *</FormLabel>
            <Select value={form.getValues("category")} onValueChange={(value) => form.setValue("category", value as any)}>
              <SelectTrigger className="border-secondary/20 focus:border-primary/50 rounded-lg h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="abaya">Abaya</SelectItem>
                <SelectItem value="scarf">Scarf</SelectItem>
                <SelectItem value="jallabiya">Jallabiya</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>

          <FormItem>
            <FormLabel className="text-foreground/70 font-medium text-sm">Color</FormLabel>
            <Input
              placeholder="e.g., Black, Navy"
              value={form.getValues("color")}
              onChange={(e) => form.setValue("color", e.target.value)}
              className="border-secondary/20 focus:border-primary/50 rounded-lg h-10"
            />
          </FormItem>

          <FormItem>
            <FormLabel className="text-foreground/70 font-medium text-sm">Length (cm)</FormLabel>
            <Input
              type="number"
              placeholder="e.g., 140"
              value={form.getValues("length") || ""}
              onChange={(e) => form.setValue("length", e.target.value ? Number(e.target.value) : undefined)}
              className="border-secondary/20 focus:border-primary/50 rounded-lg h-10"
            />
          </FormItem>

          <FormItem>
            <FormLabel className="text-foreground/70 font-medium text-sm">Product Image {!editingProduct && "*"}</FormLabel>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  form.setValue("image", file);
                  setImagePreview(URL.createObjectURL(file));
                }
              }}
              className="border-secondary/20 focus:border-primary/50 rounded-lg h-10"
            />
            {imagePreview && (
              <div className="mt-3">
                <img src={imagePreview} alt="Preview" className="h-24 w-24 object-cover rounded-lg border border-secondary/20" />
              </div>
            )}
          </FormItem>

          <FormItem className="flex items-center gap-3 pt-2">
            <Checkbox
              checked={form.getValues("isBestSeller")}
              onCheckedChange={(checked) => form.setValue("isBestSeller", checked as boolean)}
            />
            <FormLabel className="text-foreground/70 font-medium text-sm !m-0">Mark as Best Seller</FormLabel>
          </FormItem>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium text-base h-11 mt-6 rounded-full transition-all duration-300"
          >
            {isSubmitting ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
          </Button>
        </form>
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
    console.log("AdminPanel: Checking authentication");
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log("AdminPanel: Fetching /api/auth/check");
      const res = await fetch("/api/auth/check", { credentials: "include" });
      const data = await res.json();
      console.log("AdminPanel: Auth response", data);
      
      if (data.authenticated) {
        console.log("AdminPanel: User is authenticated");
        setIsAuth(true);
        loadProducts();
      } else {
        console.log("AdminPanel: User not authenticated, redirecting");
        setIsAuth(false);
        setLocation("/admin-login");
      }
    } catch (err) {
      console.error("AdminPanel: Auth error", err);
      setIsAuth(false);
      setLocation("/admin-login");
    } finally {
      setIsLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      console.log("AdminPanel: Loading products");
      const res = await fetch("/api/products?limit=100", { credentials: "include" });
      const data = await res.json();
      console.log("AdminPanel: Products loaded", data);
      setProducts(data.products || []);
    } catch (err) {
      console.error("AdminPanel: Load products error", err);
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
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground/70 text-lg font-light">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  if (isAuth === false) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <p className="text-foreground/70 text-lg font-light">Not authenticated</p>
          <p className="text-foreground/50 text-sm">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (isAuth === true) {
    return (
      <div className="min-h-screen bg-background py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center mb-8 lg:mb-12">
            <h1 className="text-4xl lg:text-5xl font-light text-primary">Admin Panel</h1>
            <Button onClick={handleLogout} variant="outline" className="border-primary/30 text-primary hover:bg-primary hover:text-white rounded-full px-6 h-11 font-medium transition-all duration-300">
              Logout
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ProductForm
                editingProduct={editingProduct}
                onSuccess={() => {
                  loadProducts();
                  setEditingProduct(null);
                }}
              />
            </div>

            <div>
              <Card className="bg-background border border-secondary/20 shadow-sm rounded-lg">
                <CardHeader className="border-b border-secondary/10 bg-secondary/5">
                  <CardTitle className="text-primary text-xl font-light">Products ({products.length})</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {products.length === 0 ? (
                      <p className="text-foreground/50 font-light text-center py-8">No products yet</p>
                    ) : (
                      products.map((p) => (
                        <div key={p.id} className="p-4 border border-secondary/10 rounded-lg bg-secondary/5 hover:bg-secondary/10 transition-colors">
                          <p className="font-medium text-foreground text-sm">{p.name}</p>
                          <p className="text-xs text-foreground/60 mt-1">{p.category}</p>
                          <p className="text-sm font-semibold text-primary mt-1">{p.price} AED</p>
                          <div className="flex gap-2 mt-3">
                            <Button
                              onClick={() => setEditingProduct(p)}
                              size="sm"
                              variant="outline"
                              className="flex-1 border-primary/30 text-primary hover:bg-primary/10 rounded-full font-medium transition-all duration-300"
                            >
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDelete(p.id)}
                              size="sm"
                              className="flex-1 bg-destructive/20 text-destructive hover:bg-destructive/30 rounded-full font-medium transition-all duration-300"
                            >
                              Delete
                            </Button>
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

  return null;
}