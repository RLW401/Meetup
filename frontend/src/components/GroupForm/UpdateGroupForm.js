import { Dispatch, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getGroupDetails } from "../../store/groupDetails";
import GroupForm from "./GroupForm";

const UpdateGroupForm = () => {
    const dispatch = useDispatch();
    const formType = "Update group";
    const groupId = Number(useParams().groupId);
    // useEffect(() => {
    //     const fetchGroup = async (groupId) => {
    //         await dispatch(getGroupDetails(groupId));
    //     };
    //     fetchGroup(groupId);
    // }, [dispatch, groupId]);
    useEffect(() => {
        dispatch(getGroupDetails(groupId));
    }, [dispatch, groupId]);
    const group = useSelector((state) => ({ ...state.groupDetails }));

    return (
        <GroupForm group={group} formType={formType} />
    );
};

export default UpdateGroupForm;
