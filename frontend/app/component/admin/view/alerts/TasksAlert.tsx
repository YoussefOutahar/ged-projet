import { Dialog } from 'primereact/dialog'
import React, { useEffect, useState } from 'react'
import useConnectedUserStore from 'Stores/Users/ConnectedUserStore'
import { CourrielBureauOrdre } from 'app/controller/model/BureauOrdre/CourrielBureauOrdre'
import axiosInstance from 'app/axiosInterceptor'
import { Tooltip } from 'primereact/tooltip'
import { stepService } from 'app/controller/service/workflow/stepService'
import { StepDTO } from 'app/controller/model/workflow/stepDTO'
import Link from 'next/link'
import { Button } from 'primereact/button'
import { AuthService } from 'app/zynerator/security/Auth.service'
import { ProgressBar } from 'primereact/progressbar'
import { t } from 'i18next'

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

type Props = {}


type Task = {
    title: string
    dueDate?: string
}

type TaskGroup = {
    id: string
    title: string
    description?: string
    tasks: Task[]
    redirectUrl?: string | null
    color?: string
    icon?: string
}

const TasksAlert = (props: Props) => {

    const [visible, setVisible] = useState(false)
    const [showComponent, setShowComponent] = useState(false)
    const [taskGroups, setTaskGroups] = useState<TaskGroup[]>([])

    // this is to prevent fetching data multiple times when the component is mounted
    const [initiallyLoaded, setInitiallyLoaded] = useState(0);

    const [progress, setProgress] = useState(0)
    const [totalCalls, setTotalCalls] = useState(3)
    const [showProgressBar, setShowProgressBar] = useState(true)
    useEffect(() => {
        if (Math.round(progress) == 100) {
            setTimeout(() => {
                setShowProgressBar(false)
            }, 1000)
        }
    }, [progress])


    const { connectedUser } = useConnectedUserStore();

    //TasksGroup : Bureau d'ordre
    const [courrielsNeedingAttention, setCourrielsNeedingAttention] = useState<Page<CourrielBureauOrdre>>()
    const fetchCourrielsNeedingAttention = async () => {
            await axiosInstance.get<Page<CourrielBureauOrdre>>(API_URL + `/courriels/needing-attention/${connectedUser?.id}`, {
                params: {
                    page: 0,
                    size: 5
                }
            }).then((res) => {
                setCourrielsNeedingAttention(res.data)
                setProgress(prev => prev + (1 / totalCalls) * 100)
            }).catch((err) => {
                // console.log("Error getting BO tasks :", err)
            }).finally(() => {
                setInitiallyLoaded(prev => prev + 1);
            });
    }
    useEffect(() => {
        if (courrielsNeedingAttention?.totalElements ?? 0 > 0) {
            const boTasksGroup: TaskGroup = {
                id: "bo",
                title: t("tasksAlert.bo.title"),
                description: t("tasksAlert.bo.description", { totalCount: courrielsNeedingAttention?.totalElements }),
                redirectUrl: '/bureau-ordre-mesCourriels',
                tasks: [],
                icon: 'pi pi-envelope'
            }
            courrielsNeedingAttention?.content.forEach(courriel => {
                boTasksGroup.tasks.push({ title: courriel.sujet, dueDate: courriel.dateEcheance })
            })
            const filtredTasksGroups = taskGroups.filter(taskGroup => taskGroup.id !== 'bo')
            setTaskGroups([...filtredTasksGroups, boTasksGroup])
        }
    }, [courrielsNeedingAttention])

    //TasksGroup : Parapheurs
    const [parapheursToSign, setParapheursToSign] = useState<Page<any>>()
    const fetchFiltredParapheurs = async (pageP?: number) => {
        return await axiosInstance.get(`${API_URL}/parapheurs/getPaginatedParapheurs/`, {
            params: {
                page: 0,
                size: 4,
                filter: "unsigned"

            }
        }).then((res) => {
            setParapheursToSign(res.data);
            setProgress(prev => prev + (1 / totalCalls) * 100)
        }).catch((err) => {
            console.log("Error getting parapheurs tasks :", err)
        }).finally(() => {
            setInitiallyLoaded(prev => prev + 1);
        });
    }

    useEffect(() => {
        if (parapheursToSign?.totalElements ?? 0 > 0) {
            const parapheursTasksGroup: TaskGroup = {
                id: "parapheurs",
                title: t("tasksAlert.parapheur.title"),
                description: t("tasksAlert.parapheur.description", { totalCount: parapheursToSign?.totalElements }),
                redirectUrl: '/parapheur',
                tasks: [],
                icon: 'pi pi-verified'
            }
            parapheursToSign?.content?.forEach(parapheur => {
                parapheursTasksGroup.tasks.push({ title: parapheur.title })
            })
            const filtredTasksGroups = taskGroups.filter(taskGroup => taskGroup.id !== 'parapheurs')
            setTaskGroups([...filtredTasksGroups, parapheursTasksGroup])
        }
    }, [parapheursToSign])

    //TasksGroup : Workflow
    const [stepsToComplete, setStepsToComplete] = useState<Page<StepDTO>>()
    const fetchStepsToComplete = async (id: number) => {
        stepService.stepsByDestinataireIdAndStatus(id, "WAITING", 0).then((res) => {
            setStepsToComplete(res.data)
            setProgress(prev => prev + (1 / totalCalls) * 100)
        }).catch((err) => {
            console.log("Error getting workflow tasks :", err)
        }).finally(() => {
            setInitiallyLoaded(prev => prev + 1);
        });
    }

    useEffect(() => {
        if (stepsToComplete?.totalElements ?? 0 > 0) {
            const workflowTasksGroup: TaskGroup = {
                id: "workflow",
                title: t("tasksAlert.workflow.title"),
                description: t("tasksAlert.workflow.description", { totalCount: stepsToComplete?.totalElements }),
                redirectUrl: '/admin/view/workflow/mesTaches',
                tasks: [],
                icon: 'pi pi-sitemap',
            }
            stepsToComplete?.content?.forEach(step => {
                workflowTasksGroup.tasks.push({ title: step.stepPreset.title || "" })
            })
            const filtredTasksGroups = taskGroups.filter(taskGroup => taskGroup.id !== 'workflow')
            setTaskGroups([...filtredTasksGroups, workflowTasksGroup])
        }
    }, [stepsToComplete])

    const refetchData = async () => {
        setProgress(0)
        setShowProgressBar(true)
        fetchFiltredParapheurs()
        if (connectedUser) fetchStepsToComplete(connectedUser.id)
        fetchCourrielsNeedingAttention()
    }

    useEffect(() => {
        if (connectedUser) {
            if (initiallyLoaded > 2) {
                refetchData()
            }
        } else {
            setTaskGroups([])
        }
    }, [connectedUser])



    useEffect(() => {
        if (initiallyLoaded > 2) {
            setTaskGroups([])
            refetchData()
        }
        // Check if the component has already been shown
        const isTasksAlertShown = sessionStorage.getItem('isTasksAlertShown');
        if (!isTasksAlertShown && showComponent) {
            // If not, show the component and set the flag in sessionStorage
            setVisible(true);
            sessionStorage.setItem('isTasksAlertShown', 'true');
        }
    }, [showComponent]);

    const auth = new AuthService()


    useEffect(() => {
        if (taskGroups.length > 0 && connectedUser && auth.getToken() !== null) {
            setShowComponent(true)
        } else if (auth.getToken() === null) {
            setShowComponent(false)
        }
    }, [taskGroups, connectedUser, auth.getToken()])

    useEffect(() => {
        if(auth.getToken() !== null && connectedUser){            
            refetchData()
        }
    }, [auth.getToken(), connectedUser])

    if (!showComponent) return null;

    return (
        <>

            <Button
                className="bg-white  border-primary text-primary border-circle shadow-5 hover:shadow-8 hover:bg-primary hover:text-white  "
                rounded raised
                style={{
                    position: 'fixed',
                    bottom: '7px',
                    right: '10px',
                    zIndex: 1000,
                    width: '50px',
                    height: '50px',
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                onClick={() => {
                    setVisible(prev => !prev)
                    refetchData()
                }
                }
            >
                <img src={`/Images/logo-yan.png`} alt="" style={{ 'width': '25px', 'height': '25px' }} />


            </Button>
            <Dialog
                header={<div className='text-center text-3xl  text-primary'>{t("tasksAlert.todaysTasks")} </div>}
                dismissableMask={true}
                headerStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.85)' }}
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.85)' }}
                // contentClassName='surface-ground' headerClassName='surface-ground'
                visible={visible}
                style={{ width: '50vw' }}
                modal={true}
                onHide={() => { setVisible(false) }}
            >
                {showProgressBar && <ProgressBar value={progress} displayValueTemplate={() => ""} className='my-2' />}
                {taskGroups.map((taskGroup, i) => (
                    <Link href={taskGroup?.redirectUrl ?? ""} onClick={() => setVisible(false)} key={`taskGroup-${i}`}>
                        <div
                            key={i}
                            className='mb-3  p-3 shadow-2 hover:shadow-4 bg-white border-round border-1 surface-border '
                        >
                            <div className='flex flex-row justify-content-between'>
                                <div className='text-xl pb-1 font-bold text-primary'>
                                    <i className={taskGroup.icon ?? "pi pi-circle "} style={{ color: taskGroup.color, paddingRight: "1rem", fontWeight: "bold" }}></i>
                                    {taskGroup.title}
                                </div>
                                {taskGroup.redirectUrl &&
                                    <>
                                        <Tooltip target=".pi-window-maximize" />
                                        <i className="pi pi-window-maximize cursor-pointer" data-pr-tooltip='Lien vers la page concernée' ></i>
                                    </>
                                }
                            </div>
                            <div className='font-bold my-2 ml-2'>
                                {taskGroup.description}
                            </div>
                            {taskGroup.tasks.map((task, j) => (
                                j < 3 &&
                                <div className='grid m-0 p-0' key={`task-${i}-${j}`}>
                                    <span className='col-1 text-base font-bold' >•</span>
                                    <span className='col-4 text-base font-base' >{task.title}</span>
                                    {task.dueDate &&
                                        <div>
                                            <span className='text-sm font-light'>Echeance : </span>
                                            <span className='text-sm font-bold'>{new Date(task.dueDate).toLocaleDateString()}</span>
                                        </div>
                                    }
                                </div>
                            ))}
                            {taskGroup.tasks.length > 3 && <div className='pl-2 text-sm font-bold' key={`moretasks-${i}`}>. . . </div>}
                        </div>
                    </Link>

                ))}

            </Dialog>
        </>

    )
}

export default TasksAlert