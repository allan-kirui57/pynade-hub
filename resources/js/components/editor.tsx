"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { common, createLowlight } from "lowlight" // Updated import
import javascript from "highlight.js/lib/languages/javascript"
import typescript from "highlight.js/lib/languages/typescript"
import php from "highlight.js/lib/languages/php"
import css from "highlight.js/lib/languages/css"
import html from "highlight.js/lib/languages/xml"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Quote,
    Heading1,
    Heading2,
    Undo,
    Redo,
    LinkIcon,
    ImageIcon,
    Code,
    FileCode,
    AlignLeft,
    AlignCenter,
    AlignRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Create a lowlight instance with common languages
const lowlight = createLowlight(common)

// Register additional languages
lowlight.register("html", html)
lowlight.register("css", css)
lowlight.register("js", javascript)
lowlight.register("ts", typescript)
lowlight.register("php", php)

interface EditorProps {
    content: string
    onChange: (content: string) => void
}

export function Editor({ content, onChange }: EditorProps) {
    const [isMounted, setIsMounted] = useState(false)
    const imageInputRef = useRef<HTMLInputElement>(null)

    // Extension for handling pasted images
    const handlePasteImages = () => {
        return {
            name: "pasteImages",
            addProseMirrorPlugins() {
                return [
                    {
                        key: new Object(),
                        props: {
                            handlePaste: (view, event) => {
                                const items = Array.from(event.clipboardData?.items || [])
                                const images = items.filter((item) => /image\//.test(item.type))

                                if (images.length === 0) {
                                    return false
                                }

                                event.preventDefault()

                                images.forEach((item) => {
                                    const blob = item.getAsFile()
                                    if (!blob) return

                                    const reader = new FileReader()
                                    reader.onload = (e) => {
                                        const result = e.target?.result
                                        if (typeof result === "string") {
                                            view.dispatch(
                                                view.state.tr.replaceSelectionWith(view.state.schema.nodes.image.create({ src: result })),
                                            )
                                        }
                                    }
                                    reader.readAsDataURL(blob)
                                })

                                return true
                            },
                        },
                    },
                ]
            },
        }
    }

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false,
            }),
            Placeholder.configure({
                placeholder: "Write your post content here...",
            }),
            Image.configure({
                allowBase64: true,
                inline: true,
            }),
            Link.configure({
                openOnClick: false,
            }),
            CodeBlockLowlight.configure({
                lowlight,
            }),
            handlePasteImages(),
        ],
        content,
        editorProps: {
            attributes: {
                class: "min-h-[300px] p-4 border rounded-md focus:outline-none prose prose-sm max-w-none",
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    // Handle hydration issues
    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return <div className="min-h-[300px] p-4 border rounded-md">Loading editor...</div>
    }

    if (!editor) {
        return null
    }

    const addImage = () => {
        if (imageInputRef.current) {
            imageInputRef.current.click()
        }
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const result = e.target?.result
                if (typeof result === "string") {
                    editor.chain().focus().setImage({ src: result }).run()
                }
            }
            reader.readAsDataURL(file)

            // Reset the input so the same file can be selected again
            if (imageInputRef.current) {
                imageInputRef.current.value = ""
            }
        }
    }

    const addImageFromUrl = () => {
        const url = window.prompt("Enter the URL of the image:")
        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes("link").href
        const url = window.prompt("Enter the URL:", previousUrl)

        if (url === null) {
            return
        }

        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run()
            return
        }

        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
    }

    const setCodeBlock = () => {
        editor.chain().focus().toggleCodeBlock().run()
    }

    const setLanguage = (language: string) => {
        editor.chain().focus().updateAttributes("codeBlock", { language }).run()
    }

    return (
        <div className="space-y-2">
            <div className="border rounded-md p-1 flex flex-wrap gap-1">
                <Toggle
                    size="sm"
                    pressed={editor.isActive("bold")}
                    onPressedChange={() => editor.chain().focus().toggleBold().run()}
                    aria-label="Bold"
                >
                    <Bold className="h-4 w-4" />
                </Toggle>

                <Toggle
                    size="sm"
                    pressed={editor.isActive("italic")}
                    onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                    aria-label="Italic"
                >
                    <Italic className="h-4 w-4" />
                </Toggle>

                <Toggle
                    size="sm"
                    pressed={editor.isActive("heading", { level: 1 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    aria-label="Heading 1"
                >
                    <Heading1 className="h-4 w-4" />
                </Toggle>

                <Toggle
                    size="sm"
                    pressed={editor.isActive("heading", { level: 2 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    aria-label="Heading 2"
                >
                    <Heading2 className="h-4 w-4" />
                </Toggle>

                <Toggle
                    size="sm"
                    pressed={editor.isActive("bulletList")}
                    onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                    aria-label="Bullet List"
                >
                    <List className="h-4 w-4" />
                </Toggle>

                <Toggle
                    size="sm"
                    pressed={editor.isActive("orderedList")}
                    onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                    aria-label="Ordered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </Toggle>

                <Toggle
                    size="sm"
                    pressed={editor.isActive("blockquote")}
                    onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                    aria-label="Quote"
                >
                    <Quote className="h-4 w-4" />
                </Toggle>

                <Toggle
                    size="sm"
                    pressed={editor.isActive("code")}
                    onPressedChange={() => editor.chain().focus().toggleCode().run()}
                    aria-label="Inline Code"
                >
                    <Code className="h-4 w-4" />
                </Toggle>

                <Toggle size="sm" pressed={editor.isActive("codeBlock")} onPressedChange={setCodeBlock} aria-label="Code Block">
                    <FileCode className="h-4 w-4" />
                </Toggle>

                <Toggle size="sm" pressed={editor.isActive("link")} onPressedChange={setLink} aria-label="Link">
                    <LinkIcon className="h-4 w-4" />
                </Toggle>

                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={addImage} className="h-8 w-8 p-0">
                        <ImageIcon className="h-4 w-4" />
                    </Button>
                    <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    <Button variant="ghost" size="sm" onClick={addImageFromUrl} className="h-8 w-8 p-0">
                        <ImageIcon className="h-4 w-4" />
                    </Button>
                </div>

                <div className="border-l mx-1"></div>

                <Toggle
                    size="sm"
                    pressed={editor.isActive({ textAlign: "left" })}
                    onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}
                    aria-label="Align Left"
                >
                    <AlignLeft className="h-4 w-4" />
                </Toggle>

                <Toggle
                    size="sm"
                    pressed={editor.isActive({ textAlign: "center" })}
                    onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}
                    aria-label="Align Center"
                >
                    <AlignCenter className="h-4 w-4" />
                </Toggle>

                <Toggle
                    size="sm"
                    pressed={editor.isActive({ textAlign: "right" })}
                    onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}
                    aria-label="Align Right"
                >
                    <AlignRight className="h-4 w-4" />
                </Toggle>

                <div className="border-l mx-1"></div>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="h-8 w-8 p-0"
                >
                    <Undo className="h-4 w-4" />
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="h-8 w-8 p-0"
                >
                    <Redo className="h-4 w-4" />
                </Button>

                {editor.isActive("codeBlock") && (
                    <Select value={editor.getAttributes("codeBlock").language || "text"} onValueChange={setLanguage}>
                        <SelectTrigger className="h-8 w-24 text-xs">
                            <SelectValue placeholder="Language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="text">Plain Text</SelectItem>
                            <SelectItem value="html">HTML</SelectItem>
                            <SelectItem value="css">CSS</SelectItem>
                            <SelectItem value="js">JavaScript</SelectItem>
                            <SelectItem value="ts">TypeScript</SelectItem>
                            <SelectItem value="php">PHP</SelectItem>
                        </SelectContent>
                    </Select>
                )}
            </div>

            {editor && (
                <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                    <div className="flex bg-background border rounded-md shadow-md">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            className={cn("h-8 w-8 p-0", editor.isActive("bold") ? "bg-muted" : "")}
                        >
                            <Bold className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={cn("h-8 w-8 p-0", editor.isActive("italic") ? "bg-muted" : "")}
                        >
                            <Italic className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={setLink}
                            className={cn("h-8 w-8 p-0", editor.isActive("link") ? "bg-muted" : "")}
                        >
                            <LinkIcon className="h-4 w-4" />
                        </Button>
                    </div>
                </BubbleMenu>
            )}

            <EditorContent editor={editor} className={cn("prose max-w-none")} />

            <div className="text-xs text-muted-foreground mt-2">
                <p>
                    💡 <strong>Pro Tips:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Paste images directly into the editor</li>
                    <li>Select text to format it with the floating toolbar</li>
                    <li>
                        Use <kbd className="px-1 py-0.5 bg-muted border rounded text-xs">Ctrl+B</kbd> for bold,{" "}
                        <kbd className="px-1 py-0.5 bg-muted border rounded text-xs">Ctrl+I</kbd> for italic
                    </li>
                    <li>Drag and drop images into the editor</li>
                </ul>
            </div>
        </div>
    )
}
