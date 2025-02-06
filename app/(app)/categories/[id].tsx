import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";
import EmojiPicker from "rn-emoji-keyboard";
import { toast } from "sonner-native";

import type { CategoryFormData } from "~/core/types/category";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { PickerButton } from "~/components/ui/picker";
import { SegmentedControl } from "~/components/ui/segmented-control";
import { Text } from "~/components/ui/text";
import { categoryFormSchema } from "~/core/validations/category";
import { useCategoriesStore } from "~/store/categories";
import { useTransactionsStore } from "~/store/transactions";

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
        await createCategory([data]);
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

            const hasTransactions = useTransactionsStore
              .getState()
              .transactions.some((t) => t.category_id === id);

            if (hasTransactions) {
              throw new Error(
                "This category has linked transactions. Please unlink or delete those transactions first.",
                { cause: "hasTransactions" }
              );
            }

            await deleteCategory(id);

            router.back();

            toast.success("Category deleted successfully.");
          } catch (error: any) {
            let message =
              "An error occurred while deleting the category. Please try again.";

            if (error.cause === "hasTransactions") {
              message = error.message;
            }

            toast.error(message);
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
            : "📋 New Category"
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="p-6"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-6">
          <View className="gap-2">
            <Label>Type</Label>
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

          <View className="gap-2">
            <Label>Emoji</Label>
            <PickerButton
              onPress={() => setIsEmojiPickerOpen(true)}
              placeholder="Select emoji"
              title={form.watch("emoji")}
            />
            <EmojiPicker
              open={isEmojiPickerOpen}
              onClose={() => setIsEmojiPickerOpen(false)}
              onEmojiSelected={(emoji) => form.setValue("emoji", emoji.emoji)}
              enableSearchBar
            />
          </View>

          <Input
            autoCapitalize="words"
            autoFocus
            error={form.formState.errors.title?.message}
            label="Title"
            onChangeText={(value) => form.setValue("title", value)}
            placeholder="Enter category title"
            value={form.watch("title")}
          />

          <Button
            onPress={form.handleSubmit(onSubmit)}
            disabled={isLoading || isDeleting}
          >
            <Text>{isEditing ? "Update" : "Create"} Category</Text>
            {isLoading && <ActivityIndicator color="white" />}
          </Button>

          {isEditing && (
            <Button
              disabled={isDeleting}
              onPress={handleDelete}
              variant="ghost"
            >
              <Text className="text-destructive group-active:text-destructive">
                Delete
              </Text>
              {isDeleting && <ActivityIndicator className="text-destructive" />}
            </Button>
          )}
        </View>
      </ScrollView>
    </>
  );
}
