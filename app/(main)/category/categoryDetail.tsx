import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { productsApi } from "../../../utils/api";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../store/cartSlice";
import { CATEGORIES } from "../../../utils/constants";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  description?: string;
  stock: number;
}

const CategoryDetail = () => {
  const { name } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Find category details for styling
  const category = CATEGORIES.find((cat) => cat.name === name);

  useEffect(() => {
    fetchProducts();
  }, [name]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch all products and filter by category
      const response = await productsApi.getProducts({ category: name });
      if (response.success && response.data) {
        setProducts(response.data);
      }
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError(err.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    dispatch(
      addToCart({
        id: product._id,
        name: product.name,
        image: product.image || "📦",
        category: product.category,
        price: product.price,
      })
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-emerald-600 px-4 pt-2 pb-4">
        <View className="flex-row items-center mb-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-3 bg-white/20 p-2 rounded-full"
          >
            <Text className="text-white text-lg">←</Text>
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold">
              {category?.icon} {name}
            </Text>
            <Text className="text-white/80 text-sm">
              {products.length} {products.length === 1 ? "product" : "products"}{" "}
              available
            </Text>
          </View>
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#059669" />
          <Text className="text-gray-500 mt-2">Loading products...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-red-500 text-center mb-2">⚠️ {error}</Text>
          <TouchableOpacity
            className="bg-emerald-600 px-4 py-2 rounded-lg"
            onPress={fetchProducts}
          >
            <Text className="text-white font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : products.length === 0 ? (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-6xl mb-4">{category?.icon || "📦"}</Text>
          <Text className="text-gray-500 text-center text-lg font-semibold">
            No products found
          </Text>
          <Text className="text-gray-400 text-center mt-2">
            There are no products available in the {name} category yet.
          </Text>
          <TouchableOpacity
            className="bg-emerald-600 px-6 py-3 rounded-lg mt-6"
            onPress={() => router.back()}
          >
            <Text className="text-white font-semibold">Browse Categories</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item: Product) => item._id}
          renderItem={({ item }: { item: Product }) => (
            <View className="bg-white rounded-xl p-4 mx-4 mb-4 shadow-sm border border-gray-100">
              <View className="flex-row">
                {/* Product Image */}
                <View className="w-24 h-24 bg-gray-50 rounded-lg items-center justify-center mr-4">
                  <Text className="text-5xl">{item.image || "📦"}</Text>
                </View>

                {/* Product Details */}
                <View className="flex-1">
                  <Text
                    className="text-lg font-semibold text-gray-800"
                    numberOfLines={2}
                  >
                    {item.name}
                  </Text>
                  <Text className="text-sm text-gray-500 mt-1">
                    {item.category}
                  </Text>
                  {item.description ? (
                    <Text className="text-xs text-gray-400 mt-1" numberOfLines={2}>
                      {item.description}
                    </Text>
                  ) : null}
                  <View className="flex-row items-center justify-between mt-2">
                    <Text className="text-xl font-bold text-emerald-600">
                      ₹{item.price}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      Stock: {item.stock}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Add to Cart Button */}
              <TouchableOpacity
                className="bg-emerald-600 rounded-lg py-3 mt-3"
                onPress={() => handleAddToCart(item)}
                activeOpacity={0.8}
              >
                <Text className="text-white text-center font-semibold">
                  Add to Cart
                </Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={{ paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default CategoryDetail;

const styles = StyleSheet.create({});
