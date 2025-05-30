import React from 'react';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { comma } from 'postcss/lib/list';

interface Props {
  addImage: () => void;
  addSignature: () => void;
  addDrawing: () => void;
  addText: () => void;
  isPdfLoaded: boolean;
  savingPdfStatus: boolean;
  savePdf: () => void;
}
export const MenuBar: React.FC<Props> = ({
  addDrawing,
  addImage,
  addSignature,
  addText,
  savingPdfStatus,
  savePdf,
}) => {
  const items: any[] = [

    // <Button
    //       icon="pi pi-plus"
    //       className="p-button-secondary p-button-outlined"
    //       style={{ marginRight: '.5rem' }}
    //     />

    {
      label: "Add",
      items: [
        { label: 'Add Image', command: addImage },
        { label: 'Add My Signature', command: addSignature },
        { label: 'Add Drawing', command: addDrawing },
        { label: 'Add Text', command: addText }
      ]

    },
    {
      label: "Save",
      // (
      //   <Button
      //     label={savingPdfStatus ? 'Saving...' : 'Save'}
      //     icon="pi pi-save"
      //     className="p-button-success p-button-outlined"
      //     onClick={savePdf}
      //     disabled={savingPdfStatus}
      //   />
      // ),
      command: savePdf
    },

  ];

  return (
    <Menubar model={items} />
  );
};
