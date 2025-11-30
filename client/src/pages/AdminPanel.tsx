import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Plus, Package, LogOut, Trash2, Edit, X, Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

import type { Product } from "@shared/schema";

const addProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  image: z.instanceof(File).refine((file) => file.size > 0, "Image is required"),
  category: z.enum(["abaya", "scarf", "jallabiya"], { required_error: "Select a category" }),
  color: z.string().optional(),
  size: z.string().optional(),
  isBestSeller: z.boolean().default(false),
});

const editProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  image: z.instanceof(File).optional(), // Optional for editing
  category: z.enum(["abaya", "scarf", "jallabiya"], { required_error: "Select a category" }),
  color: z.string().optional(),
  size: z.string().optional(),
  isBestSeller: z.boolean().default(false),
});

type ProductForm = z.infer<typeof addProductSchema>;

export default function AdminPanel() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("add");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { data: authData, isLoading: checkingAuth } = useQuery<{ authenticated: boolean }>({
    queryKey: ["/api/auth/check"],
  });

  const { data: productsData, isLoading: loadingProducts } = useQuery<{ products: Product[] }>({
    queryKey: ["/api/products"],
  });

  const products = productsData?.products || [];

  useEffect(() => {
    if (!checkingAuth && !authData?.authenticated) setLocation("/admin-login");
  }, [authData, checkingAuth, setLocation]);

  const form = useForm<ProductForm>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      name: "",
      price: 0,
      image: undefined,
      category: undefined,
      color: "",
      size: "",
      isBestSeller: false,
    },
  });

  useEffect(() => {
    if (editingProduct) {
      form.reset({
        name: editingProduct.name,
        price: editingProduct.price,
        image: undefined, // Don't set image for editing - user can optionally upload new one
        category: editingProduct.category as "abaya" | "scarf" | "jallabiya",
        color: editingProduct.color || "",
        size: editingProduct.size || "",
        isBestSeller: editingProduct.isBestSeller || false,
      });
      setImagePreview(`/api/images/${editingProduct.imageId}`);
      setActiveTab("add");
    }
  }, [editingProduct, form]);

  // --- IMAGE UPLOAD ---
  const handleFileSelect = (file: File) => {
    form.setValue("image", file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: (acceptedFiles: File[]) => acceptedFiles.length && handleFileSelect(acceptedFiles[0]),
  });

  const resetForm = () => {
    form.reset({
      name: "",
      price: 0,
      image: undefined,
      category: undefined,
      color: "",
      size: "",
      isBestSeller: false,
    });
    setImagePreview("");
    setEditingProduct(null);
  };

  const onSubmit = async (data: ProductForm) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price.toString());
      formData.append("category", data.category);
      if (data.image) formData.append("image", data.image); // Only append if image exists
      if (data.color) formData.append("color", data.color);
      if (data.size) formData.append("size", data.size);
      formData.append("isBestSeller", data.isBestSeller.toString());

      if (editingProduct) {
        await apiRequest("PATCH", `/api/products/${editingProduct.id}`, formData);
        toast({ title: "Product updated", description: "Successfully updated." });
      } else {
        await apiRequest("POST", "/api/products", formData);
        toast({ title: "Product added", description: "Successfully added." });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products/bestsellers"] });
      resetForm();
      setActiveTab("manage");
    } catch {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteProduct) return;
    try {
      await apiRequest("DELETE", `/api/products/${deleteProduct.id}`);
      toast({ title: "Product deleted" });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products/bestsellers"] });
      setDeleteProduct(null);
    } catch {
      toast({ title: "Error", description: "Delete failed", variant: "destructive" });
    }
  };

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
      setLocation("/admin-login");
    } catch {
      toast({ title: "Error", description: "Logout failed", variant: "destructive" });
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(price);

  if (checkingAuth)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen py-8" data-testid="page-admin-panel">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-medium text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground mt-1">Manage your product catalog</p>
          </div>
          <Button variant="outline" onClick={handleLogout} data-testid="button-logout">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="add" data-testid="tab-add-product">
              <Plus className="w-4 h-4 mr-2" /> {editingProduct ? "Edit Product" : "Add Product"}
            </TabsTrigger>
            <TabsTrigger value="manage" data-testid="tab-manage-products">
              <Package className="w-4 h-4 mr-2" /> Manage Products
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add">
            <Card className="max-w-2xl border-card-border">
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                <CardTitle>{editingProduct ? "Edit Product" : "Add New Product"}</CardTitle>
                {editingProduct && (
                  <Button variant="ghost" size="icon" onClick={resetForm} data-testid="button-cancel-edit">
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Luxury Black Abaya" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price (NGN)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="35000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
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
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="size"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Size (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="M, L, XL, One Size" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isBestSeller"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Best Seller</FormLabel>
                              <div className="text-sm text-muted-foreground">
                                Mark as best seller product
                              </div>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Image</FormLabel>
                          <FormControl>
                            <div
                              {...getRootProps()}
                              className="border border-dashed border-border rounded-lg p-4 cursor-pointer flex items-center justify-center"
                            >
                              <input {...getInputProps()} />
                              {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                              ) : (
                                <p className="text-muted-foreground">Drag & drop an image or click to upload</p>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {editingProduct ? "Update Product" : "Add Product"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage">
            <Card className="border-card-border">
              <CardHeader>
                <CardTitle>All Products</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingProducts ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <p className="text-center py-12 text-muted-foreground">No products yet.</p>
                ) : (
                  <div className="space-y-3">
                    {products.map((product) => (
                      <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="w-16 h-16 overflow-hidden rounded-lg">
                          <img src={`/api/images/${product.imageId}`} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h3>{product.name}</h3>
                          <p>{formatPrice(product.price)} • {product.category}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => setEditingProduct(product)}><Edit /></Button>
                          <Button onClick={() => setDeleteProduct(product)}><Trash2 /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!deleteProduct} onOpenChange={() => setDeleteProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteProduct?.name}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteProduct(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
