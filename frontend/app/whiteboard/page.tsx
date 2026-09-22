import Link from "next/link";
import { getBlocks, getTasks } from "../lib/api";
import { formatBlockDate } from "../lib/format";
import { DataError } from "../ui/data-error";
import { BlockForm } from "./block-form";

export default async function WhiteboardPage() {
  let blocks;
  let tasks;
  try {
    [blocks, tasks] = await Promise.all([getBlocks(), getTasks()]);
  } catch {
    return <DataError />;
  }

  return (
    <div className="page-content">
      <header className="page-header">
        <h1>Whiteboard</h1>
      </header>

      {blocks.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon" aria-hidden="true">✦</span>
          <h2>Пока нет блоков</h2>
          <p>Здесь появятся твои дела и заметки по темам.</p>
        </div>
      ) : (
        <div className="block-grid">
          {blocks.map((block, index) => {
            const blockTasks = tasks.filter((task) => task.blockId === block.id);
            const done = blockTasks.filter((task) => task.status === "DONE").length;
            const blockDate = formatBlockDate(block);
            return (
              <Link className={`block-card block-card-${index % 6}`} href={`/whiteboard/${block.id}`} key={block.id}>
                <div className="block-card-top">
                  <h2>{block.title}</h2>
                  <span className="block-emoji" aria-hidden="true">{block.emoji || "✦"}</span>
                </div>
                <div className="block-card-bottom">
                  <span className="block-progress"><span className="progress-icon" aria-hidden="true" />{done} / {blockTasks.length}</span>
                  {blockDate && <span className={blockDate.isDeadline ? "block-due" : "block-date"}>{blockDate.text}</span>}
                </div>
              </Link>
            );
          })}
        </div>
      )}
      <BlockForm />
    </div>
  );
}
