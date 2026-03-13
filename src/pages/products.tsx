import { useState, useMemo } from "react";
import { useProducts, useCategories, Product } from "@/hooks/use-products";
import { useCart } from "@/store/use-cart";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ShoppingCart, Star, StarHalf, Package } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { formatINR } from "@/lib/currency";

export default function Products() {
  const { data: products, isLoading, error } = useProducts();
  const { data: categories } = useCategories();
  const addToCart = useCart((state) => state.addToCart);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
    });
    toast.success("Added to cart", {
      description: `${product.title.substring(0, 30)}...`,
    });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarHalf key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-muted-foreground/30" />);
      }
    }
    return stars;
  };

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="text-destructive mb-4">
          <ShoppingCart className="w-16 h-16 opacity-50" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Failed to load products</h2>
        <p className="text-muted-foreground">Please try refreshing the page later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-card p-6 rounded-2xl border shadow-sm">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-foreground mb-2">
            Catalog
          </h1>
          <p className="text-muted-foreground">
            Explore our vast collection of premium products
          </p>
        </div>

        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-10 h-11 bg-secondary/50 rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Categories Horizontal Scroll */}
      <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          className="rounded-full shrink-0 shadow-none border-secondary-border"
          onClick={() => setSelectedCategory(null)}
        >
          All Categories
        </Button>
        {categories?.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            className="rounded-full shrink-0 shadow-none border-secondary-border capitalize"
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden flex flex-col h-[420px]">
              <Skeleton className="h-56 w-full rounded-none" />
              <div className="p-4 flex-1 space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-2/3" />
                <div className="mt-auto pt-4 flex justify-between items-center">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-10 w-24 rounded-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-dashed">
          <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground">Try adjusting your search or category filters.</p>
          <Button 
            variant="outline" 
            className="mt-6"
            onClick={() => { setSearch(""); setSelectedCategory(null); }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.05 }
            }
          }}
        >
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                layout
              >
                <Card className="group overflow-hidden flex flex-col h-full hover:shadow-xl hover:border-primary/20 transition-all duration-300 bg-card">
                  {/* Image Container */}
                  <div className="relative h-56 bg-white p-6 overflow-hidden border-b flex items-center justify-center">
                    <Badge className="absolute top-3 left-3 z-10 bg-background/80 text-foreground backdrop-blur shadow-sm border-border hover:bg-background/80 capitalize">
                      {product.category}
                    </Badge>
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Content */}
                  <CardContent className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-1 mb-2">
                      {renderStars(product.rating.rate)}
                      <span className="text-xs text-muted-foreground ml-1">({product.rating.count})</span>
                    </div>
                    <h3 className="font-semibold text-foreground line-clamp-2 leading-snug mb-2 group-hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                    
                    <div className="mt-auto pt-4 flex items-end justify-between">
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground line-through decoration-muted-foreground/50">
                          {formatINR(product.price * 1.2)}
                        </span>
                        <span className="text-2xl font-bold text-foreground">
                          {formatINR(product.price)}
                        </span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-5 pt-0">
                    <Button 
                      className="w-full rounded-xl shadow-md shadow-primary/20" 
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
