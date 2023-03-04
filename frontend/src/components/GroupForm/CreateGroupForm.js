import GroupForm from "./GroupForm";

const name = 'Mountain Group';
const about = 'Come wander into the mountains with us. No experience required. No need to bring supplies! Nature will provide :)';
const type = 'In person';
const isPrivate = false;
const city = 'Denver';
const state = 'CO';

const CreateGroupForm = () => {
    const formType = "Create group";
    const group = {
        name,
        about,
        type,
        private: isPrivate,
        city,
        state
    }
    return (
    <GroupForm group={group} formType={formType} />
    );
};

export default CreateGroupForm;
