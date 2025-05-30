import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
interface Props {
  onConfirm: () => void;
  onDismiss: () => void;
  title: string;
}

export const ConfirmContent: React.FC<Props> = ({
  title,
  onConfirm,
  onDismiss,
}) => (
  <div>
    <h4>{title}</h4>

    <Button onClick={onDismiss} label="No" />
    <Button onClick={onConfirm} label="Yes" className="p-button-danger" />
  </div>
);
