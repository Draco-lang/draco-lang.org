import "./layout.css";
import { getSpecsInfo } from "@/utils/github";
import DracoButton from "@/components/DracoButton";

interface Params {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: Params) {
  const specs = await getSpecsInfo();

  return (
    <div className="page-specs">
      <div className="sidebar">
        <DracoButton href="/specs" buttonSize="medium" className="tab-button article-active-on-Introduction">
          Introduction
        </DracoButton>
        {specs
          .filter((s) => s.name !== "Introduction")
          .map((s) => (
            <DracoButton
              key={s.name}
              href={`/specs/${s.name}`}
              buttonSize="small"
              className={`tab-button article-active-on-${s.name}`}
            >
              {camelToSpacedCamel(s.name)}
            </DracoButton>
          ))}
      </div>
      <div className="spec-content">{children}</div>
    </div>
  );
}

function camelToSpacedCamel(input: string): string {
  const words = input.split(/(?=[A-Z])/);
  return words.join(" ");
}
