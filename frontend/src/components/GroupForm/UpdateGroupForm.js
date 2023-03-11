import { Dispatch, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getGroupDetails } from "../../store/groupDetails";
import GroupForm from "./GroupForm";

const UpdateGroupForm = () => {
    const dispatch = useDispatch();
    const formType = "Update group";
    const groupId = Number(useParams().groupId);

    const [group, setGroup] = useState(null);

    useEffect(() => {
        dispatch(getGroupDetails(groupId));
    }, [dispatch, groupId]);
    const loadGroup = useSelector((state) => state.groupDetails);


    useEffect(() => {
        setGroup(loadGroup);
    }, [loadGroup]);

    if (group && (group.id === groupId)) {
        return (
            <GroupForm group={group} formType={formType} />
        );
    } else {
        return <h2>Group not found</h2>
    }
};

export default UpdateGroupForm;
