import { UtilisateurDto } from 'app/controller/model/Utilisateur.model';
import { StepPresetDTO } from 'app/controller/model/workflow/stepPresetDTO';
import { UserDestinataireDTO } from 'app/controller/model/workflow/userDestinataireDTO';
import { WorkflowPresetDTO } from 'app/controller/model/workflow/workflowPresetDTO';
import { UserDestinataireService } from 'app/controller/service/workflow/UserDestinataireService';
import { stepPresetService } from 'app/controller/service/workflow/stepPresetService';
import { WorkflowPresetService } from 'app/controller/service/workflow/workflowPresetService';
import { set } from 'date-fns';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Tag } from 'primereact/tag';
import React, { use, useEffect, useState } from 'react'

type Props = {
    connectedUser: UtilisateurDto;
}

interface task {
    userDestinataire: UserDestinataireDTO;
    stepPreset: StepPresetDTO;
    workflowPreset: WorkflowPresetDTO;

}
interface organizedTasks {
    label: string;
    tasks: task[];
}

const AssignedTasks = ({connectedUser}: Props) => {

    const [userDestinataires, setUserDestinataires] = useState<UserDestinataireDTO[]>()
    const[organizedTasks, setOrganizedTasks] = useState<organizedTasks[]>();

    let tasks: task[] = [];
    let tasksByWorkflowPreset: Map<string, task[]> = new Map<string, task[]>();


    useEffect(() => {
        getAssignedTasks();
    }, [connectedUser]);
    const getAssignedTasks = () => {
        UserDestinataireService.getUserDestinataireListByUtilisateurId(connectedUser.id)
            .then((response) => {
                setUserDestinataires(response.data);
            }).catch((error) => {
                console.log('cannot get UserDestinataires List for assigned tasks.\n error: ',error);
            });            
    }

    useEffect(() => {
        tasks = [];
        tasksByWorkflowPreset = new Map<string, task[]>();

        userDestinataires?.forEach(async (userDestinataire) => {
            const newTask :task= {
                userDestinataire: userDestinataire,
                stepPreset: {} as StepPresetDTO,
                workflowPreset: {} as WorkflowPresetDTO
            }
            await stepPresetService.getStepPresetById(userDestinataire.stepId)
                                    .then((response) => {newTask.stepPreset = response.data;})
                                    .catch((error) => console.log('cannot get stepPreset for userDestinataire.\n error: ',error));
            await WorkflowPresetService.getWorkflowPresetById(newTask.stepPreset.workflowPresetId??0)
                                    .then((response) => {newTask.workflowPreset = response.data;})
                                    .catch((error) => console.log('cannot get workflowPreset for userDestinataire.\n error: ',error));
            tasks.push(newTask); 
            organiseTasksByWorkflowPreset(newTask);
            addTasks_to_be_displayed();

         })
         
    }, [userDestinataires]);

    const organiseTasksByWorkflowPreset=(task : task) => {
        if(tasksByWorkflowPreset?.has(task.workflowPreset.title)){
            tasksByWorkflowPreset.get(task.workflowPreset.title)?.push(task);
        }else{
            tasksByWorkflowPreset?.set(task.workflowPreset.title, [task]);
        }
    }


   const addTasks_to_be_displayed = () => {
        let organizedTasks: organizedTasks[] = [];
        tasksByWorkflowPreset?.forEach((tasks, label) => {
            organizedTasks.push({label, tasks});
        });
        setOrganizedTasks(organizedTasks);
    }

return (
    <div>
        <h2 className='text-900 font-semibold text-4xl text-indigo-800'>Assigned Tasks</h2>
        {
            organizedTasks?.map((organizedTask) => {
                return (
                    <div>
                        <h3 className='text-900  text-indigo-800'>{organizedTask.label}</h3>
                        <div className='flex flex-col gap-4 mb-4'>
                            {
                                organizedTask.tasks.map((task) => {
                                    return (
                                        <Card title={task.stepPreset.title} 
                                            subTitle={task.stepPreset.description} 
                                            className='p-m-2 max-w-25rem'>
                                           
                                            <div className='grid'>
                                                <span className='col-3 text-500'>Actions: </span>
                                                <div className='col'>
                                                    {
                                                        task.stepPreset.actions?.map((action, index) => (
                                                            <Tag key={index} value={action} className='mx-2'></Tag>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        </Card>
                                    )
                                })
                            }
                        </div>
                        <Divider className='w-10'/>
                    </div>
                )
            })
        }
    </div>
)
}

export default AssignedTasks