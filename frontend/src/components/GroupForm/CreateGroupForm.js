import GroupForm from "./GroupForm";

const CreateGroupForm = () => {
    const formType = "Create group";
    const group = {
        name: '',
        about: '',
        type: '',
        private: "",
        city: '',
        state: ''
    }
    return (
    <GroupForm group={group} formType={formType} />
    );
};

export default CreateGroupForm;
