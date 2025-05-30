import React, { useMemo } from 'react';
import { Timeline } from 'primereact/timeline';
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import { WorkflowDTO } from 'app/controller/model/workflow/workflowDTO';
import { StepDTO } from 'app/controller/model/workflow/stepDTO';

interface WorkflowStepsProps {
  workflow: WorkflowDTO[];
}

const WorkflowSteps: React.FC<WorkflowStepsProps> = ({ workflow }) => {

  const getStatusColor = (status: StepDTO['status'], progress: number, isCurrent: boolean) => {
    if (status === 'DONE') return 'bg-green-50';
    if (!isCurrent) return 'bg-gray-50';
    if (progress >= 100) return 'bg-red-50';
    return 'bg-blue-50';
  };

  const calculateStepDates = (steps: StepDTO[]) => {
    let currentStepIndex = steps.findIndex(step => step.status !== 'DONE');
    if (currentStepIndex === -1) currentStepIndex = steps.length - 1;

    return steps.map((step, index) => {
      let startDate, endDate;

      if (index < currentStepIndex) {
        // Past steps
        startDate = new Date(step.createdOn);
        endDate = index === currentStepIndex - 1 ? new Date() : new Date(steps[index + 1].createdOn);
      } else if (index === currentStepIndex) {
        // Current step
        startDate = index === 0 ? new Date(step.createdOn) : new Date(steps[index - 1].createdOn);
        const validityDays = step.stepPreset.duration || 1;
        endDate = new Date(startDate.getTime() + validityDays * 24 * 60 * 60 * 1000);
      } else {
        // Future steps
        startDate = endDate = null;
      }

      return { ...step, startDate, endDate };
    });
  };

  const calculateProgress = (step: StepDTO & { startDate: Date | null, endDate: Date | null }) => {
    if (step.status === 'DONE') return 100;
    if (!step.startDate || !step.endDate) return 0;

    const now = new Date().getTime();
    const start = step.startDate.getTime();
    const end = step.endDate.getTime();

    const progress = ((now - start) / (end - start)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const calculateTimeLeft = (step: StepDTO & { startDate: Date | null, endDate: Date | null }) => {
    if (!step.endDate) return 0;
    const now = new Date().getTime();
    const timeLeft = Math.max(0, step.endDate.getTime() - now);
    return Math.ceil(timeLeft / (24 * 60 * 60 * 1000));
  };

  const customizedMarker = (item: StepDTO & { startDate: Date | null, endDate: Date | null }, index: number, steps: (StepDTO & { startDate: Date | null, endDate: Date | null })[]) => {
    const progress = calculateProgress(item);
    const isCurrent = index === steps.findIndex(step => step.status !== 'DONE');
    return (
      <span className={`flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1 bg-primary`}>
        {item.stepPreset.level}
      </span>
    );
  };

  const customizedContent = (item: StepDTO & { startDate: Date | null, endDate: Date | null }, index: number, steps: (StepDTO & { startDate: Date | null, endDate: Date | null })[]) => {
    const progress = calculateProgress(item);
    const isCurrent = index === steps.findIndex(step => step.status !== 'DONE');
    const cardColor = getStatusColor(item.status, progress, isCurrent);
    const isRightSide = !(index % 2 === 0);

    return (
      <Card
        title={item.stepPreset.title}
        subTitle={`Status: ${item.status}`}
        className={`mb-3 ${cardColor}`}
        style={{ color: 'black' }}
      >
        <p>{item.stepPreset.description || 'No description available'}</p>
        {item.startDate && <p>Start date: {item.startDate.toLocaleDateString()}</p>}
        {item.endDate && <p>End date: {item.endDate.toLocaleDateString()}</p>}
        <div className={`flex-column align-items-center mt-2 mb-1 ${isRightSide ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`flex-shrink-0 ${isRightSide ? 'ml-2' : 'mr-2'} mb-1`} style={{ minWidth: '3rem', textAlign: isRightSide ? 'left' : 'right' }}>
            {progress.toFixed(0)}%
          </div>
          <div className="flex-grow-1 mr-2">
            <ProgressBar
              value={progress}
              displayValueTemplate={() => ''}
              style={{ transform: isRightSide ? 'scaleX(-1)' : 'none' }}
            />
          </div>
        </div>
        {isCurrent && <p className="m-0">Time left: {calculateTimeLeft(item)} day(s)</p>}
      </Card>
    );
  };

  const renderCardHeader = (title: string, icon: string) => (
    <div className="bg-primary p-3 mb-3" style={{ borderRadius: '6px 6px 0 0' }}>
      <div className="flex align-items-center">
        <i className={`${icon} mr-2 text-xl text-white`}></i>
        <span className="font-bold text-xl text-white">{title}</span>
      </div>
    </div>
  );

  return (
    <div>
      {workflow.map((wf, index) => {
        const sortedSteps = useMemo(() => {
          const sorted = [...(wf.stepDTOList || [])].sort((a, b) =>
            (a.stepPreset.level || 0) - (b.stepPreset.level || 0)
          );
          return calculateStepDates(sorted);
        }, [wf.stepDTOList]);

        return (
          <Card
            key={index}
            title={renderCardHeader(wf.title ?? "Comission", "pi pi-sitemap")}
          >
            <Timeline
              value={sortedSteps}
              align="alternate"
              className="customized-timeline"
              marker={(item, index) => customizedMarker(item, index, sortedSteps)}
              content={(item, index) => customizedContent(item, index, sortedSteps)}
            />
          </Card>
        );
      })}
    </div>
  );
};

export default WorkflowSteps;