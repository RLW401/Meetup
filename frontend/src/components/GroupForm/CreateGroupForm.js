import GroupForm from "./GroupForm";

const formType = "Create group";
const dev = false;

const name = 'Mountain Group';
const about = 'Come wander into the mountains with us. No experience required. No need to bring supplies! Nature will provide :) \n\nUse this image: \n\nhttps://res.cloudinary.com/dqswruico/image/upload/v1678298838/initial_meetup_seeder/Mountain_group_uouwy3.jpg';
const type = 'In person';
const isPrivate = false;
const city = 'Asheville';
const state = 'NC';

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
