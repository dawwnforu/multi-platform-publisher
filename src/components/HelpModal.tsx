interface HelpModalProps {
  onClose: () => void;
}

export default function HelpModal({ onClose }: HelpModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content help-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>功能帮助</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <section>
            <h3>编辑器使用</h3>
            <ul>
              <li><strong>所见即所得</strong> — 输入内容直接呈现为排版格式，无需了解 Markdown</li>
              <li><strong>选中文字</strong> — 弹出浮动工具栏（加粗、斜体、链接、删除线）</li>
              <li><strong>斜杠命令 /</strong> — 输入 <code>/</code> 唤起格式菜单，可选标题、列表、表格、代码块等</li>
              <li><strong>Markdown 快捷</strong> — <code># 空格</code> 变一级标题，<code>## 空格</code> 变二级标题，<code>**文字**</code> 加粗</li>
              <li><strong>表格操作</strong> — 通过 / 插入表格，点击单元格直接编辑，工具栏可增删行列</li>
              <li><strong>图片插入</strong> — 通过 / 或工具栏插入图片，支持拖拽调整大小</li>
            </ul>
          </section>

          <section>
            <h3>平台适配</h3>
            <ul>
              <li><strong>公众号</strong> — 输出富文本 HTML（带内联样式），直接粘贴到公众号编辑器即可</li>
              <li><strong>知乎</strong> — 输出 Markdown 格式，支持表格、任务列表等完整语法</li>
              <li><strong>小红书</strong> — 自动提取纯文本（≤1000字），首张图片作为封面（建议 3:4 竖版）</li>
              <li><strong>B站专栏</strong> — 输出富文本 HTML，支持代码高亮</li>
            </ul>
            <p className="help-note">每个平台 Tab 下的预览是手机模拟效果，右侧显示字数统计和限制提醒。</p>
          </section>

          <section>
            <h3>收纳箱</h3>
            <ul>
              <li>顶部横向标签栏管理你的多篇文档</li>
              <li>点击 <strong>+</strong> 创建新分类，输入名称即可</li>
              <li>点击标签切换文档，悬停显示 × 可删除（至少保留一个）</li>
              <li>所有文档自动保存在浏览器本地存储中，刷新不丢失</li>
            </ul>
          </section>

          <section>
            <h3>发布流程</h3>
            <ol>
              <li>在编辑器中写好内容（或从收纳箱选择已有文档）</li>
              <li>切换到目标平台 Tab，查看预览效果和字数统计</li>
              <li>点击 <strong>复制内容</strong> 按钮</li>
              <li>登录对应平台编辑器，粘贴即可</li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
