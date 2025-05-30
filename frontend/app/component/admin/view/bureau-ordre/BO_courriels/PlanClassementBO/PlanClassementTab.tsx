import axiosInstance from "app/axiosInterceptor";
import { PlanClassementBO } from "app/controller/model/BureauOrdre/PlanClassementBo";
import { MessageService } from "app/zynerator/service/MessageService";
import { TFunction } from "i18next";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { Toast } from "primereact/toast";
import { Tree } from "primereact/tree";
import TreeNode from "primereact/treenode";
import { classNames } from "primereact/utils";
import { useEffect, useRef, useState } from "react";
import AddPlanBODialog from "./CreatePlanClassement";
import EditPlanClassementBO from "./EditPlanClassementBO";

type Props = {
    refetchCourriels: (planClassementId: number) => void;
    planClassementKey: number;
    setPlanClassementKey: (planClassementId: number) => void;
    showToast: (severity: SeverityType, summary: string) => void;
    toastRef: React.Ref<Toast>;
    t: TFunction;
};
type SeverityType = 'success' | 'info' | 'warn' | 'error';

interface Node {
    key: number;
    label: string;
    children?: Node[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

const PlanClassementTab = ({ refetchCourriels, planClassementKey, setPlanClassementKey, toastRef, showToast, t }: Props) => {

    const [dialogVisibleAdd, setDialogVisibleAdd] = useState(false);
    const [dialogVisibleEdit, setDialogVisibleEdit] = useState(false);

    const op = useRef<OverlayPanel>(null);

    const [nodes, setNodes] = useState<Node[]>([
        {
            key: -1,
            label: t('bo.tousLesCourriels'),
        },
    ]);
    const [clickedNode, setClickedNode] = useState<Node | null>(null);

    const fetchPlanClassementBo = async () => {
        await axiosInstance.get<PlanClassementBO[]>(`${API_URL}/plan-classement-bo/parents`).then((res) => {
            const filteredNodes = res.data.map(convertToTreeNode).filter((node): node is Node => node !== null);
            setNodes([{
                key: -1,
                label: t('bo.tousLesCourriels'),
            }, ...filteredNodes]);
        }).catch((err) => {
            console.log('err:', err);
        });
    };

    const convertToTreeNode = (data: PlanClassementBO): Node | null => {
        const treeNode: Node = {
            key: data.id ? data.id : -1,
            label: data.libelle ? data.libelle : t("bo.planClassement"),
        };

        if (data.children && data.children.length > 0) {
            treeNode.children = data.children.map(convertToTreeNode).filter((node: any): node is Node => node !== null);
        }

        return treeNode;
    };

    const handleNodeClick = (node: TreeNode) => {
        setClickedNode(node as Node);
        setPlanClassementKey(node.key === -1 ? -1 : Number(node.key));

        if (node.key === 'all') {
            // Call refetchCourriels with a special value to indicate all nodes should be selected
            refetchCourriels(-1);
        } else {
            refetchCourriels(Number(node.key) === 0 ? -1 : Number(node.key));
        }
    }



    const handleAddPlanClick = () => {
        setDialogVisibleAdd(true);
    };

    const handleNodeEditClick = () => {
        setDialogVisibleEdit(true);
    };

    const handleNodeDelite = (node: TreeNode) => {
        axiosInstance.delete(`${API_URL}/plan-classement-bo/${node.key}`).then((res) => {
            fetchPlanClassementBo();
            MessageService.showSuccess(toastRef, t('success.success'), t("success.operation"));
        }).catch((err) => {
            MessageService.showError(toastRef, t('error.error'), t("error.operation"));
        });
    }

    const handleDialogClose = () => {
        setDialogVisibleAdd(false);
        setDialogVisibleEdit(false);
    };

    useEffect(() => {
        fetchPlanClassementBo();
    }, [dialogVisibleAdd, dialogVisibleEdit]);

    return (
        <>
            <Button
                icon="pi pi-folder"
                onClick={(e) => op.current?.toggle(e)}
                tooltip={t('bo.tooltip.planClassement')}
                tooltipOptions={{ position: 'bottom' }}
            />
            <OverlayPanel ref={op}>
                <Tree
                    value={nodes}
                    style={{ border: 'none' }}
                    nodeTemplate={
                        (node: TreeNode) => {
                            const isClickedNode = clickedNode && clickedNode.key === node.key;
                            const [isHovered, setIsHovered] = useState(false);
                            return (
                                <div>
                                    <div
                                        className="flex align-content-center align-items-center gap-2 cursor-pointer"
                                        onMouseEnter={() => setIsHovered(true)}
                                        onMouseLeave={() => setIsHovered(false)}
                                    >
                                        <i className="pi pi-folder" style={{ marginRight: '0.5rem', color: '#98c34d', }} />
                                        <span onClick={() => handleNodeClick(node)} >{node.label}</span>
                                        {isHovered && <div className="align-items-center justify-content-center ml-3">
                                            <Button icon="pi pi-plus" onClick={handleAddPlanClick} className="p-button-success" style={{ borderRadius: '5rem', marginRight: '0.5rem', width: '27px', height: '27px' }} />
                                            <Button icon="pi pi-pencil" onClick={handleNodeEditClick} className="p-button-warning" style={{ borderRadius: '5rem', marginRight: '0.5rem', width: '27px', height: '27px' }} />
                                            <Button icon="pi pi-trash" onClick={() => handleNodeDelite(node)} className="p-button-danger" style={{ borderRadius: '5rem', width: '27px', height: '27px', marginRight: '0.5rem' }} />
                                        </div>}

                                    </div>
                                </div>
                            )
                        }
                    }
                    togglerTemplate={
                        (node, options) => {
                            return (
                                <>
                                    <i
                                        className={classNames('mr-3 p-tree-toggler-icon pi', { 'pi-chevron-down': options.expanded, 'pi-chevron-right': !options.expanded })}
                                        style={{ visibility: node.children && node.children.length > 0 ? 'visible' : 'hidden' }}
                                        onClick={options.onClick}
                                    />
                                </>
                            );
                        }
                    }
                />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button icon="pi pi-plus" onClick={handleAddPlanClick} className="p-button-success" style={{ borderRadius: '5rem', marginRight: '0.5rem', width: '27px', height: '27px' }} />
                </div>
            </OverlayPanel>

            {dialogVisibleAdd && (<AddPlanBODialog onClose={handleDialogClose} showToast={showToast} refreshPlans={fetchPlanClassementBo} visible={dialogVisibleAdd} parentPlanKey={planClassementKey} />)}
            {dialogVisibleEdit && (<EditPlanClassementBO onClose={handleDialogClose} showToast={showToast} refreshPlans={fetchPlanClassementBo} visible={dialogVisibleEdit} parentPlanKey={planClassementKey} />)}

        </>
    );
};

export default PlanClassementTab;