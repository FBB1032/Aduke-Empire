import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type ProductForm = {
  name: string;
  price: number;
  image?: File;
  category: "abaya" | "scarf" | "jallabiya";
  color?: string;
  length?: number; // changed from size
  isBestSeller: boolean;
};

const ProductFormComponent = ({ editingProduct }: { editingProduct?: any }) => {
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("add");

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
      setActiveTab("add");
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
      // Submit logic here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 gap-8">
        <FormField
          control={form.control}
          name="length"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel className="text-foreground/80 text-base ml-1">Length (cm)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="140"
                  {...field}
                  className="rounded-2xl border-input/60 focus:border-primary h-14 text-base px-4 bg-white/50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel className="text-foreground/80 text-base ml-1">Color (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Black, Navy, etc."
                  {...field}
                  className="rounded-2xl border-input/60 focus:border-primary h-14 text-base px-4 bg-white/50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default ProductFormComponent;