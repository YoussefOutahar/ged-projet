import React, { RefObject } from 'react';
import { ConfirmContent } from './ConfirmContent';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const ADJUSTERS_DIMENSIONS = 20;

interface Props {
  dimmerActive: boolean;
  cancelDelete: () => void;
  deleteImage: () => void;
  width: number;
  height: number;
  canvasRef: RefObject<HTMLCanvasElement>;
  positionTop: number;
  positionLeft: number;
  onClick: DragEventListener<HTMLDivElement>;
  handleMouseOut: DragEventListener<HTMLDivElement>;
  handleMouseDown: DragEventListener<HTMLDivElement>;
  handleMouseMove: DragEventListener<HTMLDivElement>;
  handleMouseUp: DragEventListener<HTMLDivElement>;
  handleImageScale: DragEventListener<HTMLDivElement>;
}

export const Image: React.FC<Props> = ({
  canvasRef,
  positionTop,
  positionLeft,
  width,
  height,
  handleMouseOut,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleImageScale,
  dimmerActive,
  cancelDelete,
  deleteImage,
  onClick,
}) => {
  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseOut={handleMouseOut}
      onDoubleClick={(e) => {
        onClick(e);
        confirmDialog({
          message: 'Are you sure you want to delete the image?',
          header: 'Delete Confirmation',
          icon: 'pi pi-exclamation-triangle',
          acceptClassName: 'p-button-danger',
          accept: deleteImage,
          reject: cancelDelete,
        });
      }}
      style={{
        position: 'absolute',
        top: positionTop,
        left: positionLeft,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: 'grey',
        width: width + 2,
        height: height + 2,
        cursor: 'move',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
      <ConfirmDialog />
      <div
        data-direction="top-left"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleImageScale}
        style={{
          position: 'absolute',
          cursor: 'nwse-resize',
          top: -5,
          left: -5,
          width: ADJUSTERS_DIMENSIONS,
          height: ADJUSTERS_DIMENSIONS,
        }}
      />
    </div>
  );
};
