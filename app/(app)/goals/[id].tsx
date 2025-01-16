import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";
import CurrencyInput from "react-native-currency-input";
import EmojiPicker from "rn-emoji-keyboard";
import { toast } from "sonner-native";

import type { GoalFormData } from "~/core/types/goal";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { PickerButton } from "~/components/ui/picker";
import { Text } from "~/components/ui/text";
import { Small } from "~/components/ui/typography";
import { goalFormSchema } from "~/core/validations/goal";
import { useGoalsStore } from "~/store/goals";

export default function GoalFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const router = useRouter();

  const isEditing = id !== "new";

  const [isLoading, setIsLoading] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);

  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const goal = useGoalsStore((state) =>
    isEditing ? state.goals.find((g) => g.id === id) : null
  );

  const { createGoal, updateGoal, deleteGoal } = useGoalsStore();

  const form = useForm<GoalFormData>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: goal ?? {
      title: "",
      emoji: "🎯"
      // amount: 0
    }
  });

  const onSubmit = async (data: GoalFormData) => {
    try {
      setIsLoading(true);

      if (isEditing) {
        await updateGoal(id, data);
      } else {
        await createGoal([data]);
      }

      router.back();

      toast.success("Goal saved successfully.");
    } catch (_error) {
      toast.error("An error occurred while saving the goal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert("Delete goal", "Are you sure?", [
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

            await deleteGoal(id);

            router.back();

            toast.success("Goal deleted successfully.");
          } catch (_error) {
            toast.error(
              "An error occurred while deleting the goal. Please try again."
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
          headerTitle: goal ? `${goal?.emoji} ${goal?.title}` : "🎯 New Goal"
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
            <Label>Goal amount</Label>
            <CurrencyInput
              autoFocus
              className="text-5xl font-bold text-foreground"
              keyboardType="number-pad"
              onChangeValue={(value) => form.setValue("amount", value ?? 0)}
              placeholder="$0,00"
              placeholderClassName="text-muted-foreground"
              prefix="$"
              style={{ lineHeight: 57.6 }}
              value={form.watch("amount")}
            />
            {!!form.formState.errors.amount?.message && (
              <Small className="text-destructive">
                {form.formState.errors.amount?.message}
              </Small>
            )}
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
            error={form.formState.errors.title?.message}
            label="Title"
            onChangeText={(value) => form.setValue("title", value)}
            placeholder="Enter goal title"
            value={form.watch("title")}
          />

          <Button
            onPress={form.handleSubmit(onSubmit)}
            disabled={isLoading || isDeleting}
          >
            <Text>{isEditing ? "Update" : "Create"} Goal</Text>
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
