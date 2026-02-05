"use client";

import axiosInstance from "@/lib/axios";

export default function DeletePostModal({
  postId,
  onClose,
}: {
  postId: number;
  onClose: () => void;
}) {
  const onDelete = async () => {
    await axiosInstance.delete(`/posts/${postId}`);
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5">
        <div className="flex items-center justify-between">
          <p className="font-semibold">Delete</p>
          <button onClick={onClose}>✕</button>
        </div>

        <p className="mt-4 text-sm text-neutral-600">Are you sure to delete?</p>

        <div className="mt-6 flex justify-end gap-4">
          <button onClick={onClose} className="text-sm">
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="rounded-xl bg-red-500 px-6 py-2 text-sm text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
