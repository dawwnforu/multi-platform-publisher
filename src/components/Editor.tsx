import { useRef, useEffect } from 'react';
import { Milkdown, MilkdownProvider, useEditor, useInstance } from '@milkdown/react';
import { Crepe } from '@milkdown/crepe';
import { editorViewCtx } from '@milkdown/kit/core';
import { replaceAll } from '@milkdown/kit/utils';
import type { Ctx } from '@milkdown/kit/ctx';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  activePlatform: string;
}

const deleteIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>';
const gifIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
const imageIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
const videoIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>';

function pickFileAndInsert(ctx: Ctx, label: string): void {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = () => {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const view = ctx.get(editorViewCtx);
      const { state, dispatch } = view;
      const { from } = state.selection;
      const text = `![${label}](${reader.result as string})`;
      dispatch(state.tr.insertText(text, from));
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

function MilkdownEditor({ value, onChange }: EditorProps) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const [instanceLoading, getInstance] = useInstance();

  useEditor((container) => {
    const crepe = new Crepe({
      root: container,
      defaultValue: value,
      featureConfigs: {
        [Crepe.Feature.BlockEdit]: {
          buildMenu: (builder) => {
            builder.addGroup('media', '媒体')
              .addItem('image', {
                label: '本地图片',
                icon: imageIcon,
                onRun: (ctx: Ctx) => {
                  pickFileAndInsert(ctx, '图片');
                },
              })
              .addItem('gif', {
                label: 'GIF动图',
                icon: gifIcon,
                onRun: (ctx: Ctx) => {
                  const url = prompt('输入 GIF 图片 URL:');
                  if (!url?.trim()) return;
                  const view = ctx.get(editorViewCtx);
                  const { state, dispatch } = view;
                  const { from } = state.selection;
                  const text = `![GIF](${url.trim()})`;
                  dispatch(state.tr.insertText(text, from));
                },
              })
              .addItem('video', {
                label: '视频',
                icon: videoIcon,
                onRun: (ctx: Ctx) => {
                  const url = prompt('输入视频 URL (支持 .mp4 / .webm / .mov 等):');
                  if (!url?.trim()) return;
                  const view = ctx.get(editorViewCtx);
                  const { state, dispatch } = view;
                  const { from } = state.selection;
                  const text = `\n▶ 视频: ${url.trim()}\n`;
                  dispatch(state.tr.insertText(text, from));
                },
              });

            builder.addGroup('operations', '操作')
              .addItem('delete', {
                label: '删除',
                icon: deleteIcon,
                onRun: (ctx: Ctx) => {
                  const view = ctx.get(editorViewCtx);
                  const { state, dispatch } = view;
                  const { from, to, $from } = state.selection;

                  if (from !== to) {
                    dispatch(state.tr.delete(from, to));
                    return;
                  }

                  const depth = $from.depth || 1;
                  const start = $from.before(depth);
                  const end = $from.after(depth);
                  dispatch(state.tr.delete(start, end));
                },
              });
          },
        },
      },
    });

    crepe.on((listener) => {
      listener.markdownUpdated((_ctx, markdown) => {
        onChangeRef.current(markdown);
      });
    });

    return crepe;
  }, []);

  // Sync editor content when value prop changes (e.g., switching documents)
  useEffect(() => {
    if (instanceLoading) return;
    const editor = getInstance();
    if (!editor) return;
    const currentMd = editor.action((ctx) => ctx.get(editorViewCtx).state.doc.textContent) ?? '';
    if (value !== currentMd) {
      editor.action(replaceAll(value));
    }
  }, [value, instanceLoading, getInstance]);

  return <Milkdown />;
}

export default function Editor(props: EditorProps) {
  return (
    <div className="editor-panel">
      <div className="editor-header">
        <h2>编辑区</h2>
        <span className="editor-hint">输入 / 唤起菜单 | 选中文字弹出工具栏 | 适配: {props.activePlatform}</span>
      </div>
      <div className="editor-body">
        <MilkdownProvider>
          <MilkdownEditor {...props} />
        </MilkdownProvider>
      </div>
    </div>
  );
}
