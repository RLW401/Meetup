import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import GroupForm from "./GroupForm";

const UpdateGroupForm = () => {
    const formType = "Update group";
    const { groupId } = useParams();
    const group = useSelector((state) => ({...state.groups[groupId]}));
    return (
        <GroupForm group={group} formType={formType} />
    );
};

export default UpdateGroupForm;
