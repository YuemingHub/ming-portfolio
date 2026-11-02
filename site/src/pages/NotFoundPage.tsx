import { ArrowLink } from "@/components/Chrome";

export function NotFoundPage() {
  return (
    <section className="section notfound">
      <div className="shell notfound-inner">
        <p className="kicker">404 · NOT FOUND</p>
        <h1>这一页还没有被建立。</h1>
        <p>你访问的地址不在本站现有页面里。回到体系总览，或从证据页查看现有记录。</p>
        <div className="next-grid">
          <ArrowLink to="/">回到首页</ArrowLink>
          <ArrowLink to="/ecosystem">打开体系总览</ArrowLink>
          <ArrowLink to="/evidence">查看证据与进展</ArrowLink>
        </div>
      </div>
    </section>
  );
}
