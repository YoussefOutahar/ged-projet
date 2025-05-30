import axiosInstance from 'app/axiosInterceptor'
import { DocumentCommentaireDto } from 'app/controller/model/DocumentCommentaireModel.model'
import { TFunction } from 'i18next'
import { Button } from 'primereact/button'
import React, { useEffect, useState } from 'react'

type stickerProps = {
    comments : DocumentCommentaireDto[];
    refresh: () => void;
    t: TFunction
}
const Sticker : React.FC<stickerProps> = ({comments, refresh, t}) => {
    const deleteComment = (commentId : number) => {
        axiosInstance.delete(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/commentaire/${commentId}`)
        .then(() => {
            refresh()
        })
        .catch((error) => {
            console.error('Error deleting comment:', error);
        });
    }
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState<{ x: number; y: number }>({ x: 31, y: 53 });
    const [initialPosition, setInitialPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                setPosition({
                    x: e.clientX - initialPosition.x,
                    y: e.clientY - initialPosition.y
                });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            // setPosition({ x: 31, y: 53 });
            // setInitialPosition({ x: 0, y: 0 });
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, initialPosition.x, initialPosition.y]);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setIsDragging(true);
        setInitialPosition({ x: e.clientX - position.x, y: e.clientY - position.y });
    };
    if (comments.length < 1) {
        return null;
    }
  return (
    <div
        className="sticky-note"
        style={{
            position: 'absolute',
            // top: '53%',
            // left: '31%',
            top: `${position.y}%`,
            left: `${position.x}%`,
            maxWidth: '350px',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
            padding: '10px',
            backgroundColor: '#e5f3fe', //a9daff
            border: '1px solid #ccc',
            borderRadius: '10px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
            opacity: '0.9',
            //transform: 'rotate(-15deg)',
        }}
        onMouseDown={handleMouseDown}
    >
        <div style={{ backgroundColor: '#35a1f4', borderRadius: '10px 10px 0 0', padding: '5px', textAlign: 'center', color: 'white', fontWeight: 'bold' }}>
            {t("Comments")}
        </div>
        <div  className="flex gap-2">
            <table>
                <tbody>
                    {comments.map((comment, index) => (
                        <tr key={index}>
                            <td>
                                {!comment.valide ? (
                                    <Button
                                    severity="success"
                                    icon="pi pi-check"
                                    onClick={() => deleteComment(comment.id)}
                                    text
                                    className="p-button p-button-rounded p-button-small ml-2 mt-2"
                                    style={{ right: '5px' }}
                                />
                                ):(
                                    <Button
                                        severity="danger"
                                        icon="pi pi-times"
                                        disabled
                                        text
                                        className="p-button p-button-rounded p-button-small ml-2 mt-2"
                                        style={{ right: '5px' }}
                                    />
                                )}
                            </td>
                            <td>
                                <span className="text-slate-600" style={{ color: '#5d4037', marginTop: '20px', 
                                    textDecoration: comment.valide ? 'line-through' : 'none'}}>{comment.contenu}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
    </div>
  )
}

export default Sticker