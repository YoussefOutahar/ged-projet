import axios from 'axios';
import React, { ChangeEvent, useState } from 'react'
import { DocumentCommentaireDto } from 'app/controller/model/DocumentCommentaireModel.model';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { TFunction } from 'i18next';

type CommentFormProps = {
    documentId: number;
    onCommentAdded: (comment: DocumentCommentaireDto) => void;
    refresh: () => void;
    t: TFunction
}

const CreateCommentaire: React.FC<CommentFormProps> = ({ documentId, onCommentAdded, refresh, t}) => {
  const [comment, setComment] = useState<string>('');
  const handleSubmit = async () => {
      try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/commentaire`, {
          documentId,
          contenu: comment,
      });
      if (response.status === 201) {
          setComment('');
          onCommentAdded(response.data);
          refresh()
      }
      } catch (error) {
      console.error('Error adding comment:', error);
      }
  };
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      setComment(e.target.value);
  };
  return (
      <div className="p-card p-shadow-3 p-p-3 p-border-round" style={{ width: '500px' }}>
        <h1 className="text-center text-slate-200 text-xl font-bold p-mb-3 mt-2">{t("sendFeedback")}</h1>
        <div className="p-field p-mb-3">
          <InputTextarea
            placeholder={t("feedback")}
            value={comment}
            onChange={handleChange}
            className="bg-slate-100 text-slate-600 placeholder:text-slate-600 placeholder:opacity-50 p-mb-2"
            required
            rows={5}
            style={{ width: '94%', margin: '1rem' }}
          />
        </div>
        <div className="p-d-flex p-jc-end" style={{ marginLeft: '450px'}}>
          <Button icon="pi pi-send" className="p-button-rounded p-button-primary mb-2" size='large' onClick={handleSubmit} disabled={comment.length === 0}/>
        </div>
      </div>
  )
}

export default CreateCommentaire