import type { TerritoireInfo } from "@/data/territoires/types";
import type { Epoque } from "@/data/epoques";
import styles from "./LegendeEpoque.module.css";

type Props = {
  epoque: Epoque;
  territoires: TerritoireInfo[];
};

export default function LegendeEpoque({ epoque, territoires }: Props) {
  return (
    <div className={styles.legend}>
      <div className={styles.title}>Légende</div>
      <ul className={styles.list}>
        {territoires.map((t) => (
          <li key={t.id} className={styles.item}>
            <span className={styles.swatch} style={{ background: t.couleur }} />
            <span className={styles.label}>{t.nom}</span>
          </li>
        ))}
      </ul>
      <div className={styles.source}>
        <span className={styles.sourceLabel}>Source :</span>
        <span className={styles.sourceText}>{epoque.sourceCartographique}</span>
      </div>
    </div>
  );
}
