import React, { RefObject } from 'react';
import { ConfirmContent } from './ConfirmContent';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

interface Props {
  path?: string;
  stroke?: string;
  width: number;
  height: number;
  strokeWidth?: number;
  positionTop: number;
  positionLeft: number;
  dimmerActive: boolean;
  cancelDelete: () => void;
  deleteDrawing: () => void;
  onClick: () => void;
  svgRef: RefObject<SVGSVGElement>;
  handleMouseDown: DragEventListener<HTMLDivElement>;
  handleMouseUp: DragEventListener<HTMLDivElement>;
  handleMouseMove: DragEventListener<HTMLDivElement>;
  handleMouseOut: DragEventListener<HTMLDivElement>;
}
export const Drawing: React.FC<Props> = ({
  dimmerActive,
  cancelDelete,
  deleteDrawing,
  positionTop,
  positionLeft,
  width,
  height,
  svgRef,
  path,
  stroke,
  strokeWidth,
  handleMouseDown,
  handleMouseMove,
  handleMouseOut,
  handleMouseUp,
  onClick,
}) => {
  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseOut={handleMouseOut}
      onDoubleClick={(e) => {
        onClick();
        confirmDialog({
          message: 'Are you sure you want to delete the drawing?',
          header: 'Delete Confirmation',
          icon: 'pi pi-exclamation-triangle',
          acceptClassName: 'p-button-danger',
          accept: deleteDrawing,
          reject: cancelDelete,
        });
      }}
      style={{
        position: 'absolute',
        top: positionTop,
        left: positionLeft,
        width,
        height,
        cursor: 'move',
      }}
    >
      <svg ref={svgRef}>
        <path
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke={stroke}
          fill="none"
          d={path}
        />
      </svg>
      <ConfirmDialog />
    </div>
  );
};
