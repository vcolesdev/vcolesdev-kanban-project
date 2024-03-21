import {useState} from "react";
import {useSortable} from "@dnd-kit/sortable";
import DeleteIcon from "../icons/DeleteIcon.tsx";
import {Column, Id} from "../types.ts";
import {CSS} from "@dnd-kit/utilities";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
}

function ColumnContainer(props: Props) {
  const {column, deleteColumn, updateColumn} = props;

  // State for the edit mode of the column, currently editing...
  const [editMode, setEditMode] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging
  } = useSortable({
      id: column.id,
      data: {
        type: "Column",
        column
      },
      disabled: editMode // Disable dragging when editing the column title
  })

  // Style for the column
  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
          bg-columnBackgroundColor
          opacity-[60%]
          border-2
          border-rose-500
          w-[350px]
          h-[500px]
          max-h-[500px]
          rounded-md
          flex
          flex-col
        "
      >
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="
        bg-columnBackgroundColor
        w-[350px]
        h-[500px]
        max-h-[500px]
        rounded-md
        flex
        flex-col
        "
    >
      {/** Column Title **/}
      <div
        {...attributes}
        {...listeners}
        className="
          bg-mainBackgroundColor
          text-md
          h-[60px]
          cursor-grab
          rounded-md
          rounded-b-none
          p-3
          font-bold
          border-columnBackgroundColor
          border-4
          flex
          items-center
          justify-between
          "
          onClick={() => {
            // You can edit the column title
            setEditMode(true);
          }}
      >
        <div className="flex gap-2">
          <div className="
            flex
            justify-center
            items-center
            bg-columnBackgroundColor
            px-2
            py-1
            text-sm
            rounded-full
            "
          >
            0
          </div>
          {!editMode && column.title}
          {editMode && (
            <input
             autoFocus
             className="
              bg-black
              focus:border-rose-500
              border
              rounded
              outline-none
              px-2
             "
             value={column.title}
             onChange={(event) => {
               // Update the column title
               updateColumn(column.id, event.target.value);
             }}
             onBlur={() => {
               // Save the new title when the input is unfocused
               setEditMode(false);
             }}
             onKeyDown={(event) => {
               if (event.key !== "Enter") return;
               setEditMode(false);
             }}
            />
          )}
        </div>
        <button
          className="
            stroke-gray-500
            hover:stroke-white
            hover:bg-columnBackgroundColor
            rounded
            px-1
            py-2
            "
            onClick={() => {
              deleteColumn(column.id);
            }}
          >
            <DeleteIcon />
        </button>
      </div>
      {/** Column Task Container **/}
      <div className="flex flex-grow">
        Content
      </div>
      {/** Column Footer **/}
      <div>Footer</div>
    </div>
  )
}

export default ColumnContainer;