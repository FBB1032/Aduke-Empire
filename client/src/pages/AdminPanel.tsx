import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Plus, Package, LogOut, Trash2, Edit, X, Star } from "lucide-react";
import { useForm } from "react-hook-form";
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

import type { Product } from "@shared/types";

type ProductForm = {
  name: string;
  price: number;
  image?: File;
  category: "abaya" | "scarf" | "jallabiya";
  color?: string;
  size?: string;
  isBestSeller: boolean;
};

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
    if (!checkingAuth && authData !== undefined && !authData.authenticated) {
      setLocation("/admin-login");
    }
  }, [authData, checkingAuth, setLocation]);

  const form = useForm<ProductForm>({
    defaultValues: {
      name: "",
      price: 0,
      image: undefined,
      category: "abaya",
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
    // Manual validation
    if (!data.name.trim()) {
      form.setError("name", { message: "Product name is required" });
      return;
    }
    if (data.price <= 0) {
      form.setError("price", { message: "Price must be greater than 0" });
      return;
    }
    if (!editingProduct && !data.image) {
      form.setError("image", { message: "Image is required" });
      return;
    }

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
      <div className="min-h-screen flex items-center justify-center bg-[--color-bg]">
        <div className="w-8 h-8 border-4 border-[--color-gold] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen py-12 bg-[--color-bg]" data-testid="page-admin-panel">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="h2-script gold-text drop-shadow-sm">Admin Panel</h1>
            <p className="subtitle mt-3 text-lg">Manage your product catalog with ease</p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout} 
            data-testid="button-logout"
            className="rounded-full px-8 h-12 text-base transition-all duration-300 border-[rgba(212,175,55,0.35)] hover:bg-[rgba(212,175,55,0.08)] hover:text-[--color-gold]"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-10">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-black/30 p-1.5 rounded-full h-14 border border-[rgba(212,175,55,0.25)]">
            <TabsTrigger 
              value="add" 
              data-testid="tab-add-product"
              className="rounded-full h-11 data-[state=active]:bg-black/50 data-[state=active]:text-[--color-gold] data-[state=active]:shadow-md transition-all duration-300 text-base font-medium"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Product
            </TabsTrigger>
            <TabsTrigger 
              value="manage" 
              data-testid="tab-manage-products"
              className="rounded-full h-11 data-[state=active]:bg-black/50 data-[state=active]:text-[--color-gold] data-[state=active]:shadow-md transition-all duration-300 text-base font-medium"
            >
              <Package className="w-4 h-4 mr-2" /> Manage Products
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add">
            <Card className="card-lux max-w-2xl">
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-8 pt-8 px-8 border-b border-[rgba(212,175,55,0.35)]">
                <CardTitle className="h2-script">{editingProduct ? "Edit Product" : "Add New Product"}</CardTitle>
                {editingProduct && (
                  <Button variant="ghost" size="icon" onClick={resetForm} data-testid="button-cancel-edit" className="rounded-full w-10 h-10 hover:bg-destructive/10 hover:text-destructive">
                    <X className="w-5 h-5" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-8 lg:p-10">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit as any)}
                    className="space-y-8"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80 text-base ml-1">Product Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Luxury Black Abaya" {...field} className="rounded-2xl border-input/60 focus:border-primary h-14 text-base px-4 bg-white/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-8">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground/80 text-base ml-1">Price (NGN)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="35000" {...field} className="rounded-2xl border-input/60 focus:border-primary h-14 text-base px-4 bg-white/50" />
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
                            <FormLabel className="text-foreground/80 text-base ml-1">Category</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="rounded-2xl border-input/60 focus:border-primary h-14 text-base px-4 bg-white/50">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-2xl border-primary/10">
                                <SelectItem value="abaya" className="text-base py-3 cursor-pointer">Abaya</SelectItem>
                                <SelectItem value="scarf" className="text-base py-3 cursor-pointer">Scarf</SelectItem>
                                <SelectItem value="jallabiya" className="text-base py-3 cursor-pointer">Jallabiya</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <FormField
                        control={form.control}
                        name="size"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground/80 text-base ml-1">Size (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="M, L, XL, One Size" {...field} className="rounded-2xl border-input/60 focus:border-primary h-14 text-base px-4 bg-white/50" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isBestSeller"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-2xl border border-input/60 p-4 bg-secondary/5 h-14 mt-8">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base font-medium">Best Seller</FormLabel>
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
                          <FormLabel className="text-foreground/80 text-base ml-1">Product Image</FormLabel>
                          <FormControl>
                            <div
                              {...getRootProps()}
                              className="border-2 border-dashed border-primary/20 hover:border-primary/50 rounded-3xl p-10 cursor-pointer flex flex-col items-center justify-center transition-all duration-300 bg-secondary/5 hover:bg-secondary/10 group"
                            >
                              <input {...getInputProps()} />
                              {imagePreview ? (
                                <div className="relative group w-full flex justify-center">
                                  <img src={imagePreview} alt="Preview" className="w-64 h-64 object-cover rounded-2xl shadow-lg group-hover:scale-105 transition-transform duration-500" />
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="bg-black/60 text-white px-6 py-3 rounded-full backdrop-blur-sm font-medium">
                                      Change Image
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center space-y-4 group-hover:scale-105 transition-transform duration-300">
                                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary shadow-sm">
                                    <Plus className="w-8 h-8" />
                                  </div>
                                  <div>
                                    <p className="text-foreground font-medium text-lg">Click to upload or drag & drop</p>
                                    <p className="text-sm text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="btn-gold w-full h-14 text-lg rounded-full mt-2 font-medium tracking-wide" 
                      disabled={isSubmitting}
                    >
                      <span className="shine" />
                      {editingProduct ? "Update Product" : "Add Product"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage">
            <Card className="card-lux">
              <CardHeader className="pb-8 pt-8 px-8 border-b border-[rgba(212,175,55,0.35)]">
                <CardTitle className="h2-script">All Products</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {loadingProducts ? (
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-28 w-full rounded-3xl" />
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-24 space-y-6">
                    <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mx-auto">
                      <Package className="w-10 h-10 text-primary/60" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-foreground text-xl font-medium">No products found</p>
                      <p className="text-muted-foreground">Start building your collection by adding a product.</p>
                    </div>
                    <Button variant="ghost" onClick={() => setActiveTab("add")} className="text-primary hover:text-primary/80 hover:bg-primary/5 rounded-full px-6">
                      Add your first product
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div key={product.id} className="flex items-center gap-6 p-4 border border-border/50 rounded-3xl hover:bg-secondary/5 transition-all duration-300 group hover:shadow-sm hover:border-primary/20 bg-white/50">
                        <div className="w-24 h-24 overflow-hidden rounded-2xl shadow-sm">
                          <img src={`/api/images/${product.imageId}`} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <div className="flex-1 min-w-0 py-2">
                          <h3 className="font-brand text-2xl text-foreground truncate mb-1">{product.name}</h3>
                          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <span className="font-semibold text-primary text-base">{formatPrice(product.price)}</span>
                            <span className="text-primary/20">•</span>
                            <span className="capitalize px-3 py-1 rounded-full bg-secondary/20 text-xs font-medium tracking-wide">{product.category}</span>
                            {product.isBestSeller && (
                              <>
                                <span className="text-primary/20">•</span>
                                <span className="flex items-center gap-1.5 text-black text-xs md:text-sm font-extrabold uppercase tracking-wider bg-gradient-to-r from-amber-300 to-yellow-400 px-3.5 py-1.5 rounded-full ring-2 ring-amber-400/60 shadow-[0_4px_16px_rgba(251,191,36,0.55)] border border-amber-200/50">
                                  <Star className="w-3.5 h-3.5 mr-0.5 fill-amber-600 text-amber-700" />
                                  Best Seller
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 px-4">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => setEditingProduct(product)}
                            className="rounded-full w-10 h-10 hover:bg-primary hover:text-white border-primary/20 hover:border-primary transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => setDeleteProduct(product)}
                            className="rounded-full w-10 h-10 hover:bg-destructive hover:text-white border-destructive/20 text-destructive hover:border-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
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
        <DialogContent className="rounded-3xl border-[rgba(212,175,55,0.35)] bg-black/50 backdrop-blur-md shadow-2xl p-8 max-w-md">
          <DialogHeader className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-2">
              <Trash2 className="w-6 h-6" />
            </div>
            <DialogTitle className="font-brand text-3xl text-foreground">Delete Product</DialogTitle>
            <DialogDescription className="text-base pt-2 leading-relaxed">
              Are you sure you want to delete <span className="font-medium text-foreground">"{deleteProduct?.name}"</span>? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3 mt-8 sm:justify-between">
            <Button variant="outline" onClick={() => setDeleteProduct(null)} className="rounded-full px-8 h-12 border-input/60 hover:bg-secondary/10 flex-1">Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} className="rounded-full px-8 h-12 shadow-lg hover:shadow-xl hover:bg-destructive/90 flex-1">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
