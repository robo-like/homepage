import { useActionData, Form, Link } from "react-router";
import { TextInput } from "~/components/TextInput";
import { Card } from "~/components/Card";
import Container from "~/components/Container";
import { H1 } from "~/components/H1";
import { postQueries } from "~/lib/db";
import type { Route } from "./+types/create-post";
import { useState, useEffect } from "react";
import { redirect } from "react-router";
import Tiptap from "~/components/TipTap";
import { TextArea } from "~/components/TextArea";

interface ActionData {
  errors?: {
    title?: string;
    slug?: string;
    summary?: string;
    body?: string;
    author?: string;
  };
  success?: boolean;
}

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const title = formData.get("title")?.toString();
  const slug = formData.get("slug")?.toString();
  const summary = formData.get("summary")?.toString();
  const body = formData.get("body")?.toString();
  const author = formData.get("author")?.toString();
  const seoTitle = formData.get("seoTitle")?.toString();
  const seoDescription = formData.get("seoDescription")?.toString();
  const seoImage = formData.get("seoImage")?.toString();

  const errors: ActionData["errors"] = {};

  if (!title) errors.title = "Title is required";
  if (!slug) errors.slug = "Slug is required";
  if (!summary) errors.summary = "Summary is required";
  if (!body) errors.body = "Content is required";
  if (!author) errors.author = "Author is required";

  if (Object.keys(errors).length > 0) {
    return { errors };
  }
  await postQueries.create({
    title: title || "",
    slug: slug || "",
    summary: summary || "",
    body: body || "",
    author: author || "",
    seoTitle,
    seoDescription,
    seoImage,
  });

  return redirect(`/admin/edit-post/${slug}`);
};

export default function CreatePost() {
  const actionData = useActionData<ActionData>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    if (isSubmitting) {
      e.preventDefault();
      return;
    }
    setIsSubmitting(true);
  };

  // Reset submission state when action data changes
  useEffect(() => {
    setIsSubmitting(false);
  }, [actionData]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Create New Post</h2>
            <p className="text-gray-600">
              Create a new blog post with rich text editing and SEO optimization.
            </p>
          </div>
          <Link
            to="/admin/posts"
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span>←</span>
            <span>Back to Posts</span>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <Form method="post" className="p-6 space-y-6" onSubmit={handleSubmit}>
          <TextInput
            label="Title"
            name="title"
            error={actionData?.errors?.title}
            required
          />

          <TextInput
            label="Slug"
            name="slug"
            error={actionData?.errors?.slug}
            required
            placeholder="my-post-url"
          />

          <TextInput
            label="Author"
            name="author"
            error={actionData?.errors?.author}
            required
          />

          <TextArea
            label="Summary"
            name="summary"
            error={actionData?.errors?.summary}
            required
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Content</label>
            <Tiptap
              name="body"
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg min-h-[200px] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 prose max-w-none"
              required
            />
            {actionData?.errors?.body && (
              <span className="text-sm text-red-500">
                {actionData.errors.body}
              </span>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">SEO Settings</h3>
            <div className="space-y-4">
              <TextInput
                label="SEO Title"
                name="seoTitle"
                placeholder="Optional custom SEO title"
              />
              <TextArea
                label="SEO Description"
                name="seoDescription"
                placeholder="Optional custom SEO description"
              />
              <TextInput
                label="SEO Image URL"
                name="seoImage"
                placeholder="Optional custom SEO image URL"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isSubmitting ? "Creating..." : "Create Post"}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
