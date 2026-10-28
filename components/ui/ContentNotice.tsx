import type { ContentStatusValue } from "@/lib/schema";
import { site } from "@/lib/content";

const copy: Record<Exclude<ContentStatusValue, "verified">, string> = {
  placeholder: "Draft page — content on this page is placeholder text awaiting verified information from LHG.",
  provisional: "Provisional page — structure and content still to be confirmed.",
};

/**
 * Small banner flagging unverified content. Turn off site-wide by setting
 * "showContentStatusNotices": false in content/site.json before launch.
 */
export function ContentNotice({ status }: { status: ContentStatusValue }) {
  if (!site.showContentStatusNotices || status === "verified") return null;
  return (
    <div role="note" className="border-b border-gold/30 bg-mist">
      <p className="container-luxe py-2.5 text-center text-[0.7rem] tracking-[0.08em] text-gold-deep">
        {copy[status]}
      </p>
    </div>
  );
}
