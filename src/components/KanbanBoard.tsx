import ColumnContainer from "./ColumnContainer.tsx";
import PlusIcon from "../icons/PlusIcon.tsx";
import {useState, useEffect, useMemo} from "react";
import {Column, Id} from "../types.ts";

import {DndContext} from "@dnd-kit/core";
import {SortableContext} from "@dnd-kit/sortable";

function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);

  // Get the ids of the columns
  const columnsId: Id[] = useMemo(() => columns.map((col) => col.id), [columns]);

  useEffect(() => {
    console.log(columns);
  }, [columns]);

  /**
   * generateId()
   * Generate a random id
   */
  const generateId = () => {
    // Generate number between 0 and 1000
    return Math.floor(Math.random() * 1001);
  }

  /**
   * createColumn()
   * Create a new column and add it to the columns array
   */
  const createColumn = () => {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`
    };

    setColumns([...columns, columnToAdd]);
  }

  /**
   * deleteColumn()
   * @param id
   * Delete a column from the columns array by id
   */
  const deleteColumn = (id: Id) => {
    // Choose all the columns except the one with this id
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);
  }

  return (
    <div className="
      m-auto
      flex
      min-h-screen
      w-full
      items-center
      overflow-x-auto
      overflow-y-hidden
      px-[40px]
    ">
      <DndContext>
        <div className="m-auto flex gap-4">
        <div className="flex gap-4">
          <SortableContext items={columnsId}>
            {columns.map((col) => {
            return (
              <ColumnContainer
                key={col.id}
                column={col}
                deleteColumn={deleteColumn}
              />
            )
          })}
          </SortableContext>
        </div>
        <button
          className="
            h-[60px]
            w-[350px]
            min-w-[350px]
            cursor-pointer
            rounded-lg
            bg-mainBackgroundColor
            border-2
            border-columnBackgroundColor
            p-4
            ring-rose-500
            hover:ring-2
            flex
            gap-2
          "
          onClick={() => {
            createColumn();
          }}
        >
          <PlusIcon />
          Add Column
        </button>
      </div>
      </DndContext>
    </div>
  )
}

export default KanbanBoard;