import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { productsApi } from "../../utils/api";
import { CATEGORIES } from "../../utils/constants";
import CategoryCard from "../../components/CategoryCard";

const Categories = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productsApi.getProducts();
      if (response.success && response.data) {
        setProducts(response.data);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // Calculate product count for each category
  const getProductCount = (categoryName: string) => {
    return products.filter((p) => p.category === categoryName).length;
  };

  // Filter categories based on search query
  const filteredCategories = CATEGORIES.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategoryPress = (categoryName: string) => {
    router.push({
      pathname: "/category/categoryDetail",
      params: { name: categoryName }
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-emerald-600 px-4 pt-2 pb-4">
        <Text className="text-white text-2xl font-bold mb-3">
          Browse Categories
        </Text>

        {/* Search Bar */}
        <View className="bg-white rounded-xl px-4 py-3 flex-row items-center">
          <Text className="text-gray-400 mr-2">🔍</Text>
          <TextInput
            className="flex-1 text-gray-800"
            placeholder="Search categories..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Text className="text-gray-400 text-lg">✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#059669" />
          <Text className="text-gray-500 mt-2">Loading categories...</Text>
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
      ) : filteredCategories.length === 0 ? (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-6xl mb-4">🔍</Text>
          <Text className="text-gray-500 text-center text-lg">
            {searchQuery
              ? `No categories found for "${searchQuery}"`
              : "No categories available"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredCategories}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CategoryCard
              category={item}
              productCount={getProductCount(item.name)}
              onPress={() => handleCategoryPress(item.name)}
            />
          )}
          contentContainerStyle={{ padding: 16 }}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default Categories;

const styles = StyleSheet.create({});