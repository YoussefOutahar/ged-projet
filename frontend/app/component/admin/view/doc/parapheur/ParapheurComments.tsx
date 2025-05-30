import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Avatar } from 'primereact/avatar';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useConnectedUserStore from 'Stores/Users/ConnectedUserStore';
import { UtilisateurDto } from 'app/controller/model/Utilisateur.model';
import axiosInstance from 'app/axiosInterceptor';
import { Badge } from 'primereact/badge';

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

type ParapheurCommentsProps = {
    parapheur: {
        id: number;
    };
};

interface ParapheurComment {
    id?: number;
    content: string;
    valid?: boolean;
    utilisateur?: UtilisateurDto;
    parapheurBoId?: number;
    createdOn?: string;
    seen?: boolean;
}

const fetchComments = async (parapheurId: number, currentUserId: number): Promise<ParapheurComment[]> => {
    const { data } = await axiosInstance.get<ParapheurComment[]>(`${API_URL}/parapheurs/getParapheurComments`, {
        params: { parapheurId, currentUserId }
    });
    return data;
};

const addComment = async (parapheurId: number, content: string, currentUserId: number): Promise<ParapheurComment> => {
    const { data } = await axiosInstance.post<ParapheurComment>(
        `${API_URL}/parapheurs/${parapheurId}/addParapheurComment`,
        content,
        {
            headers: { 'Content-Type': 'text/plain' },
            params: { currentUserId }
        }
    );
    return data;
};

const markCommentsAsSeen = async (commentIds: number[], currentUserId: number): Promise<void> => {
    await axiosInstance.post(`${API_URL}/parapheurs/markCommentsAsSeen`, commentIds, {
        params: { currentUserId }
    });
};

const ParapheurComments: React.FC<ParapheurCommentsProps> = ({ parapheur }) => {
    const [displayDialog, setDisplayDialog] = useState(false);
    const { connectedUser, profilePicture } = useConnectedUserStore();
    const [newComment, setNewComment] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();

    const commentsQueryKey = ['comments', parapheur.id, connectedUser?.id];

    const { data: comments, isLoading, error } = useQuery<ParapheurComment[], Error>({
        queryKey: commentsQueryKey,
        queryFn: () => fetchComments(parapheur.id, connectedUser?.id || 0),
    });

    const unseenCommentCount = comments ? comments.filter(comment => !comment.seen).length : 0;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (displayDialog) {
            scrollToBottom();
        }
    }, [comments, displayDialog]);

    const addCommentMutation = useMutation({
        mutationFn: ({ parapheurId, content, currentUserId }: { parapheurId: number; content: string; currentUserId: number }) =>
            addComment(parapheurId, content, currentUserId),
        onSuccess: (newComment) => {
            queryClient.setQueryData<ParapheurComment[]>(commentsQueryKey, (oldComments) => {
                return oldComments ? [...oldComments, newComment] : [newComment];
            });
            setNewComment('');
            setTimeout(scrollToBottom, 500);
        },
    });

    const markAsSeenMutation = useMutation({
        mutationFn: ({ commentIds, currentUserId }: { commentIds: number[]; currentUserId: number }) =>
            markCommentsAsSeen(commentIds, currentUserId),
        onSuccess: (_, { commentIds }) => {
            queryClient.setQueryData<ParapheurComment[]>(commentsQueryKey, (oldComments) => {
                return oldComments?.map(comment => 
                    commentIds.includes(comment.id || -1) ? { ...comment, seen: true } : comment
                ) || [];
            });
        },
    });

    useEffect(() => {
        if (displayDialog && comments) {
            const unseenCommentIds = comments
                .filter(comment => !comment.seen)
                .map(comment => comment.id)
                .filter((id): id is number => id !== undefined);

            if (unseenCommentIds.length > 0 && connectedUser?.id) {
                markAsSeenMutation.mutate({ commentIds: unseenCommentIds, currentUserId: connectedUser.id });
            }

            scrollToBottom();
        }
    }, [displayDialog, comments, connectedUser?.id]);

    const handleAddComment = () => {
        if (newComment.trim() === '' || !connectedUser?.id) return;
        addCommentMutation.mutate({ 
            parapheurId: parapheur.id, 
            content: newComment, 
            currentUserId: connectedUser.id 
        });
        setNewComment('');
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            if (newComment.trim() !== '') {
                handleAddComment();
            }
        }
    };

    const footer = (
        <div className="p-inputgroup">
            <InputText
                value={newComment}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewComment(e.target.value)}
                placeholder="Entrer un commentaire..."
                onKeyDown={handleKeyDown}
            />
            <Button
                icon="pi pi-send"
                onClick={handleAddComment}
                loading={addCommentMutation.isPending}
                disabled={newComment.trim() === ''}
            />
        </div>
    );

    const formatCreationTime = (createdOn?: string | number[]) => {
        if (!createdOn) return '';

        let date: Date;

        if (Array.isArray(createdOn)) {
            const [year, month, day, hour, minute, second] = createdOn;
            date = new Date(year, month - 1, day, hour, minute, second);
        } else {
            date = new Date(createdOn);
        }

        if (isNaN(date.getTime())) {
            console.error('Invalid date:', createdOn);
            return 'Invalid Date';
        }

        return date.toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderComments = () => {
        if (isLoading) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <ProgressSpinner />
                </div>
            );
        }

        if (error) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Message severity="error" text={(error as Error).message} />
                </div>
            );
        }

        if (!comments || comments.length === 0) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Message severity="info" text="Pas de messages sur ce parapheur" />
                </div>
            );
        }

        return comments.map((comment, index) => {
            const isCurrentUser = comment.utilisateur?.id === connectedUser?.id;
            return (
                <div key={index} style={{
                    display: 'flex',
                    justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                    marginBottom: '1rem'
                }}>
                    {!isCurrentUser && (
                        <Avatar
                            label={comment.utilisateur?.nom?.charAt(0) || 'U'}
                            image={`${API_URL}/admin/utilisateur/${comment.utilisateur?.id}/profile-picture` ?? undefined}
                            shape="circle"
                            size="normal"
                            style={{
                                backgroundColor: '#2196F3',
                                color: '#ffffff',
                                marginRight: '0.5rem'
                            }}
                        />
                    )}
                    <div style={{
                        backgroundColor: isCurrentUser ? 'var(--primary-color)' : 'var(--surface-200)',
                        color: isCurrentUser ? 'white' : 'var(--text-color)',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        maxWidth: '70%',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '0.5rem',
                            justifyContent: isCurrentUser ? 'flex-end' : 'flex-start'
                        }}>
                            <span style={{ fontWeight: 'bold', order: isCurrentUser ? 1 : 0 }}>
                                {isCurrentUser ? 'Moi' : comment.utilisateur?.nom || 'Utilisateur inconnu'}
                            </span>
                            {isCurrentUser && (
                                <Avatar
                                    label={connectedUser?.nom?.charAt(0) || 'U'}
                                    image={profilePicture ?? undefined}
                                    shape="circle"
                                    size="normal"
                                    style={{
                                        backgroundColor: '#4CAF50',
                                        color: '#ffffff',
                                        marginLeft: '0.5rem',
                                        order: 2
                                    }}
                                />
                            )}
                        </div>
                        <p style={{
                            margin: '0 0 0.5rem 0',
                            textAlign: isCurrentUser ? 'right' : 'left'
                        }}>{comment.content}</p>
                        <small style={{
                            display: 'block',
                            textAlign: 'right',
                            color: isCurrentUser ? 'rgba(255,255,255,0.7)' : 'var(--text-color-secondary)'
                        }}>
                            {formatCreationTime(comment.createdOn)}
                        </small>
                    </div>
                </div>
            );
        });
    };

    return (
        <>
            <div className="p-overlay-badge" style={{ position: 'relative' }}>
                <Button
                    rounded
                    text
                    raised
                    severity='info'
                    className='bg-primary'
                    icon="pi pi-envelope text-xl"
                    tooltip='Commentaires'
                    onClick={() => setDisplayDialog(true)}
                />
                {unseenCommentCount > 0 && (
                    <Badge value={unseenCommentCount.toString()} severity="danger" />
                )}
            </div>
            <Dialog
                header="Commentaires"
                visible={displayDialog}
                style={{ width: '50vw' }}
                onHide={() => setDisplayDialog(false)}
                footer={footer}
                className="p-fluid"
            >
                <div style={{ width: '100%', height: '300px', overflowY: 'auto' }} className='mt-4'>
                    {renderComments()}
                    <div ref={messagesEndRef} />
                </div>
            </Dialog>
        </>
    );
};

export default ParapheurComments;