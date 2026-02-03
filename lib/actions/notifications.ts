"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createNotification({
  userId,
  title,
  message,
  type = "info",
  link,
}: {
  userId: string
  title: string
  message: string
  type?: "info" | "success" | "warning" | "error"
  link?: string
}) {
  const supabase = await createClient()

  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    title,
    message,
    type,
    link,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard/notifications")
  return { success: true }
}

export async function markNotificationAsRead(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard/notifications")
  return { success: true }
}

export async function markAllNotificationsAsRead() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", user.id)
    .eq("read", false)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard/notifications")
  return { success: true }
}

export async function deleteNotification(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("notifications").delete().eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard/notifications")
  return { success: true }
}

export async function getUnreadNotificationsCount() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return 0
  }

  const { count } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("read", false)

  return count || 0
}
