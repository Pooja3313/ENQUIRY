const Users = require("../Model/Userschema");
const Enquiry = require("../Model/EnquirySchema");

const register = async (req, res) => {
  try {
    const { name, email, phone, password, cpassword } = req.body;

    const userExist = await Users.findOne({ email });

    if (userExist) {
      return res.status(400).json({ msg: "email already exists" });
    } else if (password !== cpassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    const userCreated = await Users.create({
      name,
      email,
      phone,
      password,
      cpassword,
    });

    if (!userCreated) {
      return res.status(500).json({ message: "Failed to create user" });
    }

    res.status(201).json({ message: "Registration Successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await Users.findOne({ email });
    console.log(userExist);

    if (!userExist) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await userExist.comparePassword(password);
    console.log(isPasswordValid);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    return res.status(200).json({
      status: 200,
      message: "Login Successful",
      token: await userExist.generateToken(),
      userId: userExist._id.toString(),
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const CreateEnquiryUserById = async (req, res) => {
  try {
    const { customerName, mobile, email, interestedProducts, createdBy } =
      req.body;

    const newEnquiry = new Enquiry({
      customerName,
      mobile,
      email,
      interestedProducts,
      createdBy,
    });

    await newEnquiry.save();
    res
      .status(201)
      .json({ message: "Enquiry created successfully", enquiry: newEnquiry });
  } catch (error) {
    console.error("Error creating enquiry:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get All Enquiries
const GetAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find();
    console.log(enquiries);
    res
      .status(200)
      .json({ message: "Enquiries retrieved successfully", enquiries });
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Enquiry
const UpdateEnquiryUserById = async (req, res) => {
  try {
    const { UserID } = req.params;
    console.log("id", UserID);
    const updateData = req.body;
    const updatedEnquiry = await Enquiry.findByIdAndUpdate(UserID, updateData, {
      new: true,
    });

    if (!updatedEnquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }
    res
      .status(200)
      .json({
        message: "Enquiry updated successfully",
        enquiry: updatedEnquiry,
      });
  } catch (error) {
    console.error("Error updating enquiry:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Enquiry
const DeleteEnquiryUserById = async (req, res) => {
  try {
    const { UserID } = req.params;
    const deletedEnquiry = await Enquiry.findByIdAndDelete(UserID);

    if (!deletedEnquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }
    res.status(200).json({ message: "Enquiry deleted successfully" });
  } catch (error) {
    console.error("Error deleting enquiry:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  register,
  login,
  CreateEnquiryUserById,
  GetAllEnquiries,
  UpdateEnquiryUserById,
  DeleteEnquiryUserById,
};
