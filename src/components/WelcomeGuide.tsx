interface WelcomeGuideProps {
  onDismiss: () => void;
}

export default function WelcomeGuide({ onDismiss }: WelcomeGuideProps) {
  return (
    <div className="modal-overlay">
      <div className="modal-content welcome-modal">
        <div className="welcome-hero">
          <h1>欢迎使用 Multi-Platform Publisher</h1>
          <p>一次编辑，多平台适配发布</p>
        </div>
        <div className="modal-body">
          <section>
            <h3>所见即所得编辑器</h3>
            <p>像写文档一样写作，<strong>无需了解 Markdown</strong>。直接输入文字即可看到排版效果。</p>
            <ul>
              <li>输入 <code>#</code> + 空格 → 一级标题，<code>##</code> → 二级标题，以此类推</li>
              <li>选中文字弹出浮动工具栏：加粗、斜体、链接、删除线</li>
              <li>输入 <code>/</code> 唤起全部格式菜单：标题、列表、表格、代码块、图片、视频、删除等</li>
              <li>支持 <strong>拖拽调整</strong> 图片大小，点击表格单元格直接编辑内容</li>
              <li><strong>快捷键</strong>：<code>Ctrl+B</code> 加粗，<code>Ctrl+I</code> 斜体，<code>Ctrl+Z</code> 撤销</li>
            </ul>
          </section>

          <section>
            <h3>一键适配多平台</h3>
            <p>写完内容后，右侧面板切换到对应平台 Tab 即可预览效果。</p>
            <ul>
              <li><strong>公众号</strong> — 输出带内联样式的富文本，直接粘贴到公众号编辑器</li>
              <li><strong>知乎</strong> — 保留完整 Markdown 格式，支持表格和任务列表</li>
              <li><strong>小红书</strong> — 自动提取纯文本，首张图片作为封面（3:4竖版），限1000字</li>
              <li><strong>B站专栏</strong> — 输出富文本 HTML，支持代码语法高亮</li>
            </ul>
            <p>每个平台右侧显示 <strong>字数统计</strong> 和限制提醒，点击 <strong>复制内容</strong> 即可粘贴到对应平台。</p>
          </section>

          <section>
            <h3>插入图片和视频</h3>
            <p>输入 <code>/</code> 打开菜单，在「媒体」分组中：</p>
            <ul>
              <li><strong>本地图片</strong> — 从电脑选择图片文件，自动转 base64 嵌入文档</li>
              <li><strong>GIF动图</strong> — 输入 GIF 图片 URL，在编辑器中直接播放</li>
              <li><strong>视频</strong> — 输入视频 URL，预览中渲染为可播放的视频播放器</li>
            </ul>
          </section>

          <section>
            <h3>收纳箱管理文档</h3>
            <p>顶部下拉菜单管理你的所有文档，类似浏览器收藏夹：</p>
            <ul>
              <li>预置 <strong>学习、工作、个人、运营账号</strong> 四个文件夹</li>
              <li>展开文件夹点击文档名即可切换</li>
              <li>每个文件夹旁有 <strong>+</strong> 新建文档、<strong>×</strong> 删除文件夹</li>
              <li>底部「新建文件夹」可创建自定义分类</li>
              <li>所有数据自动保存在 <strong>浏览器本地存储</strong>，刷新不丢失</li>
            </ul>
          </section>

          <section>
            <h3>大纲导航 & 布局调整</h3>
            <ul>
              <li>左侧边栏自动提取文章标题生成目录，点击可<strong>快速跳转</strong></li>
              <li>不需要时点击 <strong>«</strong> 一键收起，只留 30px 竖条</li>
              <li>三栏之间的 <strong>绿色分隔线</strong> 可拖拽调整各面板宽度</li>
            </ul>
          </section>

          <section>
            <h3>完整发布流程</h3>
            <ol>
              <li>在编辑器中写好内容（或从收纳箱选择已有文档）</li>
              <li>切换到目标平台 Tab，查看预览效果和字数是否超限</li>
              <li>通过 / 菜单插入图片、视频等媒体</li>
              <li>点击 <strong>复制内容</strong> 按钮</li>
              <li>登录对应平台编辑器，粘贴即可发布</li>
            </ol>
          </section>

          <p className="help-note">按右上角 <strong>?</strong> 可随时查看完整功能帮助文档。</p>
        </div>
        <div className="welcome-footer">
          <button className="welcome-btn" onClick={onDismiss}>
            开始使用
          </button>
        </div>
      </div>
    </div>
  );
}
