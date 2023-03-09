import GroupForm from "./GroupForm";

const name = 'Mountain Group';
const about = 'Come wander into the mountains with us. No experience required. No need to bring supplies! Nature will provide :)';
const type = 'In person';
const isPrivate = false;
const city = 'Asheville';
const state = 'NC';

const dev = true;

const devGroup = {
    name,
    about,
    type,
    private: isPrivate,
    city,
    state
}

const productionGroup = {
    name: "",
    about: "",
    type: "",
    private: "",
    city: "",
    state: ""
}

const CreateGroupForm = () => {
    const formType = "Create group";
    let group;
    if (dev) {
        group = devGroup;
    } else {
        group = productionGroup;
    }
    return (
    <GroupForm group={group} formType={formType} />
    );
};

export default CreateGroupForm;
