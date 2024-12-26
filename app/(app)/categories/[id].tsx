import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  View
} from "react-native";
import EmojiPicker from "rn-emoji-keyboard";
import { toast } from "sonner-native";

import type { CategoryFormData } from "~/core/types/category";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { SegmentedControl } from "~/components/ui/segmented-control";
import { Text } from "~/components/ui/text";
import { P } from "~/components/ui/typography";
import { categoryFormSchema } from "~/core/validations/category";
import { TrashIcon } from "~/lib/icons";
import { useCategoriesStore } from "~/store/categories";

export default function CategoryFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const router = useRouter();

  const isEditing = id !== "new";

  const [isLoading, setIsLoading] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);

  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const category = useCategoriesStore((state) =>
    isEditing ? state.categories.find((c) => c.id === id) : null
  );

  const { createCategory, deleteCategory, updateCategory } =
    useCategoriesStore();

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: category ?? {
      type: "expense",
      title: "",
      emoji: "📋"
    }
  });

  const onSubmit = async (data: CategoryFormData) => {
    try {
      setIsLoading(true);

      if (isEditing) {
        await updateCategory(id, data);
      } else {
        await createCategory(data);
      }

      router.back();

      toast.success("Category saved successfully.");
    } catch (_error) {
      toast.error(
        "An error occurred while saving the category. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert("Delete category", "Are you sure?", [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setIsDeleting(true);

            await deleteCategory(id);

            router.back();

            toast.success("Category deleted successfully.");
          } catch (_error) {
            toast.error(
              "An error occurred while deleting the category. Please try again."
            );
          } finally {
            setIsDeleting(false);
          }
        }
      }
    ]);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: category
            ? `${category?.emoji} ${category?.title}`
            : "New Category"
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="p-6"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-6">
          <View>
            <P className="mb-2">Type</P>
            <SegmentedControl
              values={["Expense", "Income"]}
              selectedIndex={form.watch("type") === "expense" ? 0 : 1}
              onChange={(event) => {
                form.setValue(
                  "type",
                  event.nativeEvent.selectedSegmentIndex === 0
                    ? "expense"
                    : "income"
                );
              }}
            />
          </View>

          <View>
            <P className="mb-2">Emoji</P>
            <TouchableOpacity
              className="h-32 w-32 items-center justify-center self-center rounded-3xl border-2 border-primary bg-primary-foreground"
              onPress={() => setIsEmojiPickerOpen(true)}
            >
              <Text className="text-4xl">{form.watch("emoji")}</Text>
            </TouchableOpacity>
            <EmojiPicker
              open={isEmojiPickerOpen}
              onClose={() => setIsEmojiPickerOpen(false)}
              onEmojiSelected={(emoji) => form.setValue("emoji", emoji.emoji)}
              enableSearchBar
            />
          </View>

          <View>
            <P className="mb-2">Title</P>
            <Input
              placeholder="Enter category title"
              value={form.watch("title")}
              onChangeText={(value) => form.setValue("title", value)}
              error={form.formState.errors.title?.message}
            />
          </View>

          <Button onPress={form.handleSubmit(onSubmit)} disabled={isLoading}>
            <Text>{isEditing ? "Update" : "Create"} Category</Text>
            {isLoading && <ActivityIndicator color="white" />}
          </Button>

          {isEditing && (
            <Button
              className="mt-4"
              disabled={isDeleting}
              onPress={handleDelete}
              variant="destructive"
            >
              <TrashIcon className="text-destructive-foreground" />
              <Text className="text-destructive-foreground">
                Delete Category
              </Text>
              {isDeleting && <ActivityIndicator color="white" />}
            </Button>
          )}
        </View>
      </ScrollView>
    </>
  );
}
