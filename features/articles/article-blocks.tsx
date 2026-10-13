import { KeyPoints, PullQuote } from "@/components/ui/editorial";
import type { Block } from "@/lib/content/types";
import type { RubriqueSlug } from "@/lib/rubriques";
import { CoverImage, ImageCredit } from "./cover-image";

export function ArticleBlocks({ blocks, rubrique }: { blocks: Block[]; rubrique: RubriqueSlug }) {
  return (
    <div className="article-body">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "p":
            return <p key={i}>{block.text}</p>;
          case "h2":
            return (
              <h2 key={i} className="type-h2 rule-top">
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="type-h3">
                {block.text}
              </h3>
            );
          case "quote":
            return <PullQuote key={i} text={block.text} cite={block.cite} />;
          case "keypoints":
            return <KeyPoints key={i} title={block.title} items={block.items} />;
          case "image":
            return (
              <figure key={i}>
                <CoverImage image={block.image} rubrique={rubrique} sizes="(min-width: 768px) 720px, 100vw" />
                <figcaption>
                  <ImageCredit image={block.image} caption={block.caption} />
                </figcaption>
              </figure>
            );
        }
      })}
    </div>
  );
}
