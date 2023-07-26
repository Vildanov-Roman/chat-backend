// Import the module from its respective file (make sure to use the correct file path).
import User from './user';

// Define an interface for the module exports to provide type information.
interface Models {
    User: typeof User;
}

// Create an object with the exported module.
const models: Models = {
    User
};

export default models;
``