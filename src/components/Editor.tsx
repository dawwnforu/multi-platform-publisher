import { useRef } from 'react';
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react';
import { Crepe } from '@milkdown/crepe';
import { editorViewCtx } from '@milkdown/kit/core';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  activePlatform: string;
}

const deleteIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>';
const gifIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
const videoIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>';

function MilkdownEditor({ value, onChange }: EditorProps) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEditor((container) => {
    const crepe = new Crepe({
      root: container,
      defaultValue: value,
      featureConfigs: {
        [Crepe.Feature.BlockEdit]: {
          buildMenu: (builder) => {
            builder.addGroup('media', '媒体')
              .addItem('gif', {
                label: 'GIF动图',
                icon: gifIcon,
                onRun: (ctx) => {
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
                onRun: (ctx) => {
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
                onRun: (ctx) => {
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

  return <Milkdown />;
}

export default function Editor(props: EditorProps) {
  return (
    <div className="editor-panel">
      <div className="editor-header">
        <h2>编辑区</h2>
        <span className="editor-hint">选中文字弹出格式工具栏 | 输入 / 唤起菜单 | # 空格 → 标题 | 适配: {props.activePlatform}</span>
      </div>
      <div className="editor-body">
        <MilkdownProvider>
          <MilkdownEditor {...props} />
        </MilkdownProvider>
      </div>
    </div>
  );
}
