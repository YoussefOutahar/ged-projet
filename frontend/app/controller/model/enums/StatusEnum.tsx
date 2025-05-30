import { t } from 'i18next';

export enum StatusEnum{
    DONE = 'DONE',
    PROGRESS = 'PROGRESS',
    PARTIAL = 'PARTIAL',
    WAITING = 'WAITING',
    REJETER = 'REJETER',
    OPEN = 'OPEN',
    CLOSED = 'CLOSED',
}

export const statusOptions = [
    { label: t('status.Done'), value: StatusEnum.DONE, color: "green-700" },
    { label: t('status.Progress'), value: StatusEnum.PROGRESS },
    { label: t('status.Partial'), value: StatusEnum.PARTIAL },
    { label: t('status.Waiting'), value: StatusEnum.WAITING, color: "orange-700" },
    { label: t('status.Rejeter'), value: StatusEnum.REJETER },
    { label: t('status.Open'), value: StatusEnum.OPEN },
    { label: t('status.Closed'), value: StatusEnum.CLOSED },
];

export const getFilteredStatusOptions = (status: StatusEnum) => {
    return statusOptions.filter((option) => option.value === status)[0];
}; 