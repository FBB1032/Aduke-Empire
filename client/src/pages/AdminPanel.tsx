import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
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

const ProductFormComponent = ({ editingProduct, onSuccess }: { editingProduct?: any; onSuccess?: () => void }) => {
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProductForm>({
    defaultValues: {
      name: "",
      price: 0,
      image: undefined,
      category: "abaya",
      color: "",
      length: undefined,
      isBestSeller: false,
    },
  });

  useEffect(() => {
    if (editingProduct) {
      form.reset({
        name: editingProduct.name,
        price: editingProduct.price,
        image: undefined,
        category: editingProduct.category as "abaya" | "scarf" | "jallabiya",
        color: editingProduct.color || "",
        length: editingProduct.length ?? undefined,
        isBestSeller: editingProduct.isBestSeller || false,
      });
      setImagePreview(`/api/images/${editingProduct.imageId}`);
    }
  }, [editingProduct, form]);

  const onSubmit = async (data: ProductForm) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price.toString());
      formData.append("category", data.category);
      if (data.image) formData.append("image", data.image);
      if (data.color) formData.append("color", data.color);
      if (data.length !== undefined) formData.append("length", String(data.length));
      formData.append("isBestSeller", data.isBestSeller.toString());

      const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products";
      const method = editingProduct ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to save product");
      }

      const result = await response.json();
      alert(editingProduct ? "Product updated successfully!" : "Product created successfully!");
      form.reset();
      setImagePreview(undefined);
      onSuccess?.();
    } catch (error) {
      console.error("Submit error:", error);
      alert("Error saving product: " + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{editingProduct ? "Edit Product" : "Add New Product"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Black Abaya"
                    {...field}
                    className="rounded-lg border-input/60 focus:border-primary h-10"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Price Field */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (AED)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="rounded-lg border-input/60 focus:border-primary h-10"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category Field */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="rounded-lg border-input/60">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="abaya">Abaya</SelectItem>
                    <SelectItem value="scarf">Scarf</SelectItem>
                    <SelectItem value="jallabiya">Jallabiya</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Color Field */}
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Black, Navy, White"
                    {...field}
                    className="rounded-lg border-input/60 focus:border-primary h-10"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Length Field */}
          <FormField
            control={form.control}
            name="length"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Length (cm) (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="140"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    className="rounded-lg border-input/60 focus:border-primary h-10"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Field */}
          <FormField
            control={form.control}
            name="image"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Product Image {!editingProduct && "(Required)"}</FormLabel>
                <FormControl>
                  <div className="space-y-2">
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
                      {...fieldProps}
                      className="rounded-lg border-input/60 focus:border-primary h-10"
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-32 w-32 object-cover rounded-lg border border-input/60"
                        />
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Best Seller Field */}
          <FormField
            control={form.control}
            name="isBestSeller"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="!mt-0 cursor-pointer">Mark as Best Seller</FormLabel>
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default function AdminPanel() {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check", {
          credentials: "include",
        });
        const data = await response.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          fetchProducts();
        } else {
          setIsAuthenticated(false);
          setLocation("/admin-login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
        setLocation("/admin-login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [setLocation]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products?limit=100", {
        credentials: "include",
      });
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setLocation("/admin-login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Admin Panel</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <ProductFormComponent editingProduct={editingProduct} onSuccess={() => {
              fetchProducts();
              setEditingProduct(null);
            }} />
          </div>

          {/* Products List Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Products ({products.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {products.length === 0 ? (
                    <p className="text-gray-500 text-sm">No products yet</p>
                  ) : (
                    products.map((product) => (
                      <div key={product.id} className="p-2 border rounded-lg hover:bg-gray-50">
                        <p className="font-semibold text-sm truncate">{product.name}</p>
                        <p className="text-xs text-gray-600">{product.category}</p>
                        <p className="text-xs font-bold text-primary">{product.price} AED</p>
                        <div className="flex gap-2 mt-2">
                          <Button
                            onClick={() => setEditingProduct(product)}
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={async () => {
                              if (confirm("Delete this product?")) {
                                try {
                                  await fetch(`/api/products/${product.id}`, {
                                    method: "DELETE",
                                    credentials: "include",
                                  });
                                  fetchProducts();
                                } catch (error) {
                                  alert("Failed to delete product");
                                }
                              }
                            }}
                            size="sm"
                            variant="destructive"
                            className="flex-1"
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