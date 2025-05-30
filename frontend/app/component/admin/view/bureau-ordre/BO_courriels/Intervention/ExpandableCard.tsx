import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useState } from "react";


interface Props {
    Header: React.ReactNode;
    Content: React.ReactNode;
    Footer: React.ReactNode;
    color?: string;
}

const ExpandableCard = ({ Header, Content, Footer, color }: Props) => {
    const [expanded, setExpanded] = useState<boolean>(false);

    const handleClick = () => {
        setExpanded(!expanded);
    };


    return (
        <Card
            style={{ backgroundColor: color }}
            className={((expanded === true) ? " expanded-card" : "collapsed-card")}
            header={
                <div className={`mt-4 ml-4 mr-4 header-content ${expanded ? "mb-0" : "mb-6"}`}>
                    {Header}
                    <Button
                        icon={(expanded ? "pi pi-chevron-up" : "pi pi-chevron-down")}
                        onClick={handleClick}
                        rounded text aria-label="Filter"
                    />
                </div>
            }
        >
            <div className="card-content">
                {expanded && <div className="mb-8">{Content}</div>}
                <div className="footer">{Footer}</div>
            </div>
        </Card>
    );
};

export default ExpandableCard;