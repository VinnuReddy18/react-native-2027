import { Text, TouchableOpacity } from "react-native";
import React from "react";
import { Category } from "../utils/constants";

interface CategoryCardProps {
  category: Category;
  productCount: number;
  onPress: () => void;
}

const CategoryCard = ({ category, productCount, onPress }: CategoryCardProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`${category.color} rounded-xl p-4 mb-4 shadow-sm`}
      style={{ width: "48%" }}
      activeOpacity={0.7}
    >
      <Text className="text-4xl mb-2">{category.icon}</Text>
      <Text className="text-lg font-bold text-gray-800" numberOfLines={1}>
        {category.name}
      </Text>
      <Text className="text-sm text-gray-600">
        {productCount} {productCount === 1 ? "product" : "products"}
      </Text>
    </TouchableOpacity>
  );
};

export default CategoryCard;
