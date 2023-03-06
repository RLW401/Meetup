import GroupForm from "./GroupForm";

const UpdateGroupForm = (group) => {
    const formType = "Update group";
    return (
        <GroupForm group={group} formType={formType} />
    );
};
