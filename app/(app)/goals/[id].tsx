import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";
import { toast } from "sonner-native";

import type { GoalFormData } from "~/core/types/goal";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { P } from "~/components/ui/typography";
import { goalFormSchema } from "~/core/validations/goal";
import { TrashIcon } from "~/lib/icons";
import { useGoalsStore } from "~/store/goals";

export default function GoalFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const router = useRouter();

  const isEditing = id !== "new";

  const [isLoading, setIsLoading] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);

  const goal = useGoalsStore((state) =>
    isEditing ? state.goals.find((g) => g.id === id) : null
  );

  const { createGoal, updateGoal, deleteGoal } = useGoalsStore();

  const form = useForm<GoalFormData>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: goal ?? {
      title: "",
      emoji: "🎯",
      amount: 0
    }
  });

  const onSubmit = async (data: GoalFormData) => {
    try {
      setIsLoading(true);

      if (isEditing) {
        await updateGoal(id, data);
      } else {
        await createGoal(data);
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
          headerTitle: goal ? `${goal?.emoji} ${goal?.title}` : "New Goal"
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
            <P className="mb-2">Emoji</P>
            <Input
              placeholder="Select an emoji"
              value={form.watch("emoji")}
              onChangeText={(value) => form.setValue("emoji", value)}
              error={form.formState.errors.emoji?.message}
            />
          </View>

          <View>
            <P className="mb-2">Title</P>
            <Input
              placeholder="Enter goal title"
              value={form.watch("title")}
              onChangeText={(value) => form.setValue("title", value)}
              error={form.formState.errors.title?.message}
            />
          </View>

          <View>
            <P className="mb-2">Target Amount</P>
            <Input
              keyboardType="numeric"
              placeholder="Enter amount"
              value={form.watch("amount").toString()}
              onChangeText={(value) => {
                const amount = parseFloat(value) || 0;

                form.setValue("amount", amount);
              }}
              error={form.formState.errors.amount?.message}
            />
          </View>

          <Button onPress={form.handleSubmit(onSubmit)} disabled={isLoading}>
            <Text>{isEditing ? "Update" : "Create"} Goal</Text>
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
              <Text className="text-destructive-foreground">Delete Goal</Text>
              {isDeleting && <ActivityIndicator color="white" />}
            </Button>
          )}
        </View>
      </ScrollView>
    </>
  );
}
