// src/Tiptap.tsx
import {
  useEditor,
  EditorContent,
  FloatingMenu,
  BubbleMenu,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

const extensions = [StarterKit];

interface TipTapProps {
  name: string;
  className?: string;
  required?: boolean;
  initialContent?: string;
}

const Tiptap = ({
  name,
  className,
  required,
  initialContent = "<p>Begin typing here...</p>",
}: TipTapProps) => {
  const editor = useEditor({
    extensions,
    content: initialContent,
    editorProps: {
      attributes: {
        class: className ?? "",
      },
    },
    immediatelyRender: false,
  });

  // Hidden input to store editor content for form submission
  useEffect(() => {
    if (!editor) return;

    const form = editor?.view.dom.closest("form");
    if (!form) return;

    // Create hidden input if it doesn't exist
    let hiddenInput = form.querySelector(
      `input[name="${name}"]`
    ) as HTMLInputElement;
    if (!hiddenInput) {
      hiddenInput = document.createElement("input");
      hiddenInput.type = "hidden";
      hiddenInput.name = name;
      if (required) hiddenInput.required = true;
      form.appendChild(hiddenInput);
    }

    // Update hidden input when content changes
    const updateHiddenInput = () => {
      hiddenInput.value = editor.getHTML();
    };

    editor.on("update", updateHiddenInput);
    updateHiddenInput(); // Set initial value

    return () => {
      editor.off("update", updateHiddenInput);
      hiddenInput.remove();
    };
  }, [editor, name, required]);

  if (!editor) return null;

  return (
    <>
      <EditorContent editor={editor} />
      {/* <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
            <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu> */}
    </>
  );
};

export default Tiptap;
