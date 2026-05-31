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
            <p>像写文档一样写作，无需了解 Markdown。选中文字弹出格式工具，输入 <code>/</code> 唤起全部格式菜单。</p>
          </section>

          <section>
            <h3>一键适配多平台</h3>
            <p>写完内容后，切换到公众号、知乎、小红书、B站任一 Tab，自动适配对应格式。点击复制即可粘贴发布。</p>
          </section>

          <section>
            <h3>收纳箱管理你的文档</h3>
            <p>顶部标签栏可创建多个分类，每篇文档独立保存。数据存在浏览器本地，下次打开还在。</p>
          </section>

          <section>
            <h3>大纲导航</h3>
            <p>左侧边栏自动提取文章标题生成目录，点击可快速跳转。不需要时可一键收起。</p>
          </section>
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
