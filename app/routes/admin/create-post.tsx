import { useActionData, Form, Link } from "react-router";
import { TextInput } from "~/components/TextInput";
import { Card } from "~/components/Card";
import Container from "~/components/Container";
import { H1 } from "~/components/H1";
import { postQueries } from "~/lib/db/index.server";
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
    <Container className="mt-10">
      <div className="mb-4">
        <Link
          to="/admin"
          className="text-sm text-gray-400 hover:text-white flex items-center gap-2"
        >
          <span>←</span>
          <span>Back to Admin</span>
        </Link>
      </div>

      <div className="mb-8">
        <H1>Create New Post</H1>
        <p className="text-gray-400">
          Create a new blog post with rich text editing and SEO optimization.
        </p>
      </div>

      <Card>
        <Form method="post" className="space-y-6" onSubmit={handleSubmit}>
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
            <label className="text-sm font-medium text-gray-300">Content</label>
            <Tiptap
              name="body"
              className="px-3 py-2 bg-white/5 border border-gray-700 rounded-lg min-h-[200px] focus:outline-none focus:ring-2 focus:ring-[#6A1E55] prose prose-invert max-w-none"
              required
            />
            {actionData?.errors?.body && (
              <span className="text-sm text-red-500">
                {actionData.errors.body}
              </span>
            )}
          </div>

          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-bold mb-4">SEO Settings</h3>
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

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#6A1E55] text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Post"}
            </button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}
