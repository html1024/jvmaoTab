import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { Button, Tooltip } from "antd";
import Link from "@tiptap/extension-link";
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import StarterKit from "@tiptap/starter-kit";
// import Image from "./image";
import { useDebounceFn, useMemoizedFn } from "ahooks";
import {
    IconBold,
    IconItalic,
    IconList,
    IconListDetails,
} from "@tabler/icons-react";
import "./small.scss";
import styled from "styled-components";


const Btn = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
`;


function MenuBar(props) {
    const { editor } = props;

    const menuItem = useMemoizedFn((item) => {
        const { onClick, disabled, active, title, Icon } = item;
        return (
            <Tooltip title={title}>
                <Btn
                    onClick={onClick}
                    disabled={disabled}
                    size="small"
                    type={"text"}
                    icon={<Icon size={16} stroke={1.4} />}
                />
            </Tooltip>
        );
    }, []);

    if (!editor) {
        return null;
    }

    return (
        <div className="sn-small-editor-menuBar">
            {menuItem({
                onClick: () => editor.chain().focus().toggleBold().run(),
                disabled: !editor.can().chain().focus().toggleBold().run(),
                active: editor.isActive("bold"),
                title: "加粗",
                Icon: IconBold,
            })}
            {menuItem({
                onClick: () => editor.chain().focus().toggleTaskList().run(),
                disabled: false,
                active: editor.isActive("taskList"),
                title: "任务列表",
                Icon: IconListDetails,
            })}
        </div>
    )
}

export default (props) => {
    const { event, content } = props

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                protocols: ["ftp", "mailto"],
                autolink: false,
            }),
            // Image,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            debouncedRun(editor);
        },
    });

    const { run: debouncedRun } = useDebounceFn((content) => {
        event.emit(content)
    }, { wait: 50 })

    React.useEffect(() => {
        if (editor) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    React.useEffect(() => {

        let timer = null;

        if (editor && editor.isEmpty) {
            timer = setTimeout(() => {
                if (editor.isDestroyed) {
                    return;
                }
                // scrollIntoView 必须关掉：便签是绝对定位的，位置越界时
                // ProseMirror 会把外层 overflow:hidden 的首屏容器整个滚走，
                // 而且没有滚动条可以滚回来，导致布局永久错位
                editor.commands.focus('end', { scrollIntoView: false });
            }, 300);
        }


        return () => {
            if (timer) {
                clearTimeout(timer);
            }
            if (editor) {
                editor.destroy()
            }
        }
    }, [editor])

    return (
        <div className={"sn-small-editor"}>
            {editor && <MenuBar editor={editor} />}
            <EditorContent
                editor={editor}
            />
        </div>
    );
};
