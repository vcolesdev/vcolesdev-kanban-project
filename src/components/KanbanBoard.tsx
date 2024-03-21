import {createPortal} from "react-dom";
import ColumnContainer from "./ColumnContainer.tsx";
import PlusIcon from "../icons/PlusIcon.tsx";
import {useState, useEffect, useMemo} from "react";
import {Column, Id} from "../types.ts";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor, TouchSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {arrayMove, SortableContext} from "@dnd-kit/sortable";

function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);

  // Get the ids of the columns
  const columnsId: Id[] = useMemo(() => columns.map((col) => col.id), [columns]);

  // Get a reference to the active column
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // 3px
      }
    }),
    useSensor(TouchSensor)
  )

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

  /**
   * updateColumn()
   * @param id
   * @param title
   * Update the title of a column by id
   */
  const updateColumn = (id: Id, title: string) => {
    const newColumns = columns.map((col) => {
      // If the column id does not match the id, return the column unchanged
      if (col.id !== id) {
        return col;
      }
      return {...col, title};
    })
    // Update the columns array with the new columns
    setColumns(newColumns);
  }

  /**
   * onDragStart()
   * @param event
   * Dispatch an action when a drag starts
   */
  const onDragStart = (event: DragStartEvent) => {
    // If the active data is a column, set the active column
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
  }

  /**
   * onDragEnd()
   * @param event
   * Dispatch an action when a drag ends
   */
  const onDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;
    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) return;

    setColumns(columns => {
      const activeColumnsIndex = columns.findIndex((col) => col.id === activeColumnId);
      const overColumnIndex = columns.findIndex((col) => col.id === overColumnId);

      return arrayMove(columns, activeColumnsIndex, overColumnIndex);
    })
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
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className="m-auto flex gap-4">
        <div className="flex gap-4">
          <SortableContext items={columnsId}>
            {columns.map((col) => {
            return (
              <ColumnContainer
                key={col.id}
                column={col}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
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

        {/** Drag overlay component **/}
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  )
}

export default KanbanBoard;