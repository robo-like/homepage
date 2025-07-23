import {
  useActionData,
  useLoaderData,
  Form,
  Link,
  useSearchParams,
} from "react-router";
import { TextInput } from "~/components/TextInput";
import { Card } from "~/components/Card";
import Container from "~/components/Container";
import { H1 } from "~/components/H1";
import { postQueries } from "~/lib/db";
import type { Route } from "./+types/edit-post.$slug";
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

export const loader = async ({ params }: Route.LoaderArgs) => {
  const post = await postQueries.getBySlug(params.slug);
  if (!post) {
    throw new Response("Post not found", { status: 404 });
  }
  return { post };
};

export const action = async ({ request, params }: Route.ActionArgs) => {
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

  await postQueries.updateBySlug(params.slug, {
    title,
    slug,
    summary,
    body,
    author,
    seoTitle,
    seoDescription,
    seoImage,
  });

  return redirect(`/admin/edit-post/${slug}?flash=Post updated successfully`);
};

export default function EditPost() {
  const { post } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const actionData = useActionData<ActionData>();
  const flashMessage = searchParams.get("flash");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    if (isSubmitting) {
      e.preventDefault();
      return;
    }
    setIsSubmitting(true);
  };

  useEffect(() => {
    setIsSubmitting(false);
  }, [post]);

  return (
    <div className="space-y-6">
      {flashMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {flashMessage}
        </div>
      )}

      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Edit Post</h2>
            <p className="text-gray-600">
              Edit your blog post with rich text editing and SEO optimization.
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
            defaultValue={post.title}
            error={actionData?.errors?.title}
            required
          />

          <TextInput
            label="Slug"
            name="slug"
            defaultValue={post.slug}
            error={actionData?.errors?.slug}
            required
            placeholder="my-post-url"
          />

          <TextInput
            label="Author"
            name="author"
            defaultValue={post.author}
            error={actionData?.errors?.author}
            required
          />

          <TextArea
            label="Summary"
            name="summary"
            defaultValue={post.summary}
            error={actionData?.errors?.summary}
            required
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Content</label>
            <Tiptap
              name="body"
              initialContent={post.body}
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
                defaultValue={post.seoTitle || ""}
                placeholder="Optional custom SEO title"
              />
              <TextArea
                label="SEO Description"
                name="seoDescription"
                defaultValue={post.seoDescription || ""}
                placeholder="Optional custom SEO description"
              />
              <TextInput
                label="SEO Image URL"
                name="seoImage"
                defaultValue={post.seoImage || ""}
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
