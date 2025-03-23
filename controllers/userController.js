const createDynamoDbService = require("../services/userService");

const dynamoDbService = createDynamoDbService();

const getUserDetails = async (req, res) => {
  try {
    const donarId = req.query.donarId;
    const userDetails = await dynamoDbService.getUserDetails(donarId);
    if (!userDetails) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json(userDetails);
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching user details", error });
  }
};

const checkUserDetails = async (req, res) => {
  try {
    const userInput = req.query.userInput;
    const passwordHash = req.query.passwordHash;
    const userDetails = await dynamoDbService.getUserDetailsFromEmailOrUserName(userInput, passwordHash);
    if (!userDetails) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json(userDetails);
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching user details", error });
  }
};

const updateUserDetails = async (req, res) => {
  try {
    const donarId = req.query.donarId
    // const { createDate, currentBalance, email, passwordHash, userName } =
    //   req.body
    const updatedUser = await dynamoDbService.updateUserDetails(donarId, req.body);
    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json(updatedUser);
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating user details", error });
  }
};

const deleteUser = async (req, res) => {
    try {
        const donarId = req.query.donarId;
        const deleted = await dynamoDbService.deleteUserDetails(donarId);
        res.status(200).json({ message: "User deleted successfully" , deleted});
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
};


  const createUser = async (req,res) => {
    try{
        const newdonar = await dynamoDbService.createUserDetails(req.body)
        res.status(200).json(newdonar)
    }catch (err) {
        console.log('Error',err)
        res.status(500).json({ message: "Error", err })
    }
}

  
module.exports = {
  getUserDetails,
  checkUserDetails,
  updateUserDetails,
  deleteUser,
  createUser
};
