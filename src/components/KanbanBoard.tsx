import {createPortal} from "react-dom";
import ColumnContainer from "./ColumnContainer.tsx";
import PlusIcon from "../icons/PlusIcon.tsx";
import {useState, useEffect, useMemo} from "react";
import {Column, Id, Task} from "../types.ts";

import {
  DndContext,
  DragEndEvent, DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor, TouchSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {arrayMove, SortableContext} from "@dnd-kit/sortable";
import TaskCard from "./TaskCard.tsx";

/**
 * KanbanBoard()
 * The main component for the Kanban board
 */
function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);

  // Get the ids of the columns
  const columnsId: Id[] = useMemo(() => columns.map((col) => col.id), [columns]);

  // Create a state to store tasks
  const [tasks, setTasks] = useState<Task[]>([]);

  // Get a reference to the active column
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  // Get a reference to the active task
  const [activeTask, setActiveTask] = useState<Task | null>(null);

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

    // Choose all the tasks except the ones with this column id
    const newTasks = tasks.filter((task) => task.columnId !== id);
    setTasks(newTasks);
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
   * createTask()
   * @param columnId
   * Create a new task in a column by id
   */
  const createTask = (columnId: Id) => {
    const newTask: Task = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`
    }
    setTasks([...tasks, newTask]);
  }

  /**
   * deleteTask()
   * @param id
   * Delete a task from the tasks array by id
   */
  const deleteTask = (id: Id) => {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  /**
   * updateTask()
   * @param id
   * @param content
   * Update the content of a task by id
   */
  const updateTask = (id: Id, content: string) => {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) {
        return task;
      }
      return {...task, content};
    });
    setTasks(newTasks);
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

    // If the active data is a task, set the active task
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  /**
   * onDragEnd()
   * @param event
   * Dispatch an action when a drag ends
   */
  const onDragEnd = (event: DragEndEvent) => {
    // When drag ends we move our drag overlay components
    setActiveColumn(null);
    setActiveTask(null);

    // Get event properties
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

  /**
   * onDragOver()
   * @param event
   * Dispatch an action when a drag is over
   */
  const onDragOver = (event: DragOverEvent) => {
    const {active, over} = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Dropping a task over another task, save the current active and over task states
    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";

    // If there is no active task, return
    if (!isActiveTask) return;

    // If both of these are active/true, then we can swap the tasks
    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        // Find the index of both tasks in the tasks array
        const activeIndex = tasks.findIndex((task) => task.id === activeId);
        const overIndex = tasks.findIndex((task) => task.id === overId);

        // If the column Ids of the tasks are different, make them the same
        tasks[activeIndex].columnId = tasks[overIndex].columnId;

        // Swap the tasks
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    // Dropping a task over a column
    const isOverColumn = over.data.current?.type === "Column";

    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.id === activeId);

        tasks[activeIndex].columnId = overId;

        // arrayMove() with the same index because we are triggering a re-render
        // of our tasks, because we're creating a new array
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
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
        onDragOver={onDragOver}
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
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (task) => {
                    return task.columnId === col.id
                  })}
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
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (task) => {
                    return task.columnId === activeColumn.id
                  })}
              />
            )}
            {
              activeTask && (
                <TaskCard
                  task={activeTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              )
            }
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  )
}

export default KanbanBoard;