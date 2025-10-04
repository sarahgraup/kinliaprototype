// src/components/collections/CreateCollectionModal.tsx
"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CreateCollectionInput } from "@/types";
import { validateCollectionName } from "@/lib/utils/validators";

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateCollectionInput) => Promise<void>;
}

export const CreateCollectionModal: React.FC<CreateCollectionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateCollectionName(name);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");
      await onSubmit({ name, description: description || undefined });
      setName("");
      setDescription("");
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create collection"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Collection"
      size="sm"
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            label="Collection name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
            error={error}
            helperText={`${50 - name.length} characters remaining`}
            placeholder="e.g., Summer Concerts"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Collection description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={250}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20"
            placeholder="What's this collection about?"
          />
          <p className="mt-1 text-sm text-gray-500">
            {250 - description.length} characters
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
