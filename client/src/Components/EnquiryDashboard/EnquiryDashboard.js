import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  Switch,
  Box,
  Grid,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../Store/authh";

const EnquiryDashboard = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [currentEnquiry, setCurrentEnquiry] = useState(null);
  const { token, UserIDFROMLSGet, userID } = useAuth();
  const [formData, setFormData] = useState({
    customerName: "",
    mobile: "",
    email: "",
    interestedProducts: [],
    active: true,
    createdBy: userID,
  });
  const [errors, setErrors] = useState({});

  const productOptions = [
    "Face Wash",
    "Moisturizer",
    "Sunscreen",
    "Shampoo",
    "Conditioner",
    "Body Lotion",
    "Hair Serum",
    "Lip Balm",
  ];

  useEffect(() => {
    fetchEnquiries();
  }, []);

  useEffect(() => {
    setFilteredEnquiries(
      enquiries.filter((enquiry) =>
        enquiry.customerName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, enquiries]);

  const fetchEnquiries = async () => {
    try {
      const response = await axios.get("/api/authh/GetAllEnquiries", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEnquiries(response.data.enquiries);
    } catch (error) {
      toast.error("Failed to fetch enquiries");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProductChange = (event) => {
    setFormData({ ...formData, interestedProducts: event.target.value });
  };

  const openModal = (enquiry = null) => {
    setCurrentEnquiry(enquiry);
    setFormData(
      enquiry
        ? {
            ...enquiry,
            createdBy: enquiry.createdBy || userID,
          }
        : {
            customerName: "",
            mobile: "",
            email: "",
            interestedProducts: [],
            active: true,
            createdBy: userID,
          }
    );
    setIsModalOpen(true);
  };
  console.log("UserIDFROMLSGet:", userID);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const validateForm = () => {
    let newErrors = {};

    // Customer Name Validation
    if (!formData.customerName.trim()) {
      newErrors.customerName = "Please enter customer name.";
    } else if (formData.customerName.length < 3) {
      newErrors.customerName = "Customer Name must be at least 3 characters.";
    }

    // Mobile Number Validation
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Please enter mobile number.";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be exactly 10 digits.";
    }

    // Email Validation
    if (!formData.email.trim()) {
      newErrors.email = "Please enter email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    // Interested Products Validation
    if (
      !formData.interestedProducts ||
      formData.interestedProducts.length === 0
    ) {
      newErrors.interestedProducts = "Please select at least one product.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      if (currentEnquiry) {
        await axios.put(
          `/api/authh/UpdateEnquiry/${currentEnquiry._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Enquiry updated successfully");
      } else {
        await axios.post("/api/authh/CreateEnquiry", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("pooja", token);
        toast.success("Enquiry added successfully");
      }
      fetchEnquiries();
      closeModal();
    } catch (error) {
      toast.error("Failed to save enquiry");
    }
  };

  const openDeleteConfirm = (enquiry) => {
    setCurrentEnquiry(enquiry);
    setIsDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/authh/DeleteEnquiry/${currentEnquiry._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Enquiry deleted successfully");
      fetchEnquiries();
      closeDeleteConfirm();
    } catch (error) {
      toast.error("Failed to delete enquiry");
    }
  };

  return (
    <Box
      sx={{
        width: "1000px",
        height: "500px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        marginLeft: "200px",
        position: "sticky",
        overflow: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "10px",
        }}
      >
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          color="primary"
          style={{ marginLeft: "10px" }}
          onClick={() => openModal()}
        >
          Add Enquiry
        </Button>
      </div>
  
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        
        <Table>
          <TableHead
            sx={{
              position: "sticky",
              top: 0,
              backgroundColor: "#f5f5f5",
              zIndex: 1,
            }}
          >
            <TableRow>
              <TableCell>
                <b>SR NO.</b>
              </TableCell>
              <TableCell>
                <b>CUSTOMER NAME</b>
              </TableCell>
              <TableCell>
                <b>MOBILE</b>
              </TableCell>
              <TableCell>
                <b>EMAIL</b>
              </TableCell>
              <TableCell>
                <b>PRODUCT</b>
              </TableCell>
              <TableCell>
                <b>ACTIONS</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEnquiries.map((enquiry, index) => (
              <TableRow key={enquiry._id}>
                <TableCell>{index + 1}</TableCell>

                <TableCell>{enquiry.customerName}</TableCell>
                <TableCell>{enquiry.mobile}</TableCell>
                <TableCell>{enquiry.email}</TableCell>
                <TableCell>{enquiry.interestedProducts.join(", ")}</TableCell>

                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => openModal(enquiry)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => openDeleteConfirm(enquiry)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* Add/Edit Enquiry Modal */}
      <Dialog open={isModalOpen} onClose={closeModal}>
        <DialogTitle>
          {currentEnquiry ? "Edit" : "Add"} Enquiry
          <IconButton
            sx={{ position: "absolute", right: 10, top: 10 }}
            onClick={closeModal}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2} style={{ marginTop: "0px" }}>
            <Grid item xs={12}>
              <TextField
                label="Customer Name"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                fullWidth
                error={!!errors.customerName}
                helperText={errors.customerName}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                fullWidth
                inputProps={{
                  maxLength: 10,
                }}
                error={!!errors.mobile}
                helperText={errors.mobile}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl
                fullWidth
                variant="outlined"
                error={!!errors.interestedProducts}
              >
                <InputLabel>Interested Products</InputLabel>
                <Select
                  multiple
                  value={formData.interestedProducts}
                  onChange={handleProductChange}
                  label="Interested Products"
                >
                  {productOptions.map((product) => (
                    <MenuItem key={product} value={product}>
                      {product}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.interestedProducts}</FormHelperText>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="User ID"
                name="createdBy"
                value={formData.createdBy}
                fullWidth
                disabled
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "16px",
            marginTop: "-25px",
            marginLeft: "11px",
            marginRight: "8px",
          }}
        >
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            style={{ width: "100px" }}
          >
            Save
          </Button>
          <Button onClick={closeModal} variant="contained" color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={isDeleteConfirmOpen}
        onClose={closeDeleteConfirm}
        style={{
          padding: "100px",
          borderRadius: "13px",
        }}
      >
        <DialogTitle>
          Confirm Deletion
          <IconButton
            sx={{ position: "absolute", right: 10, top: 10 }}
            onClick={closeDeleteConfirm}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          Are you sure you want to delete this{" "}
          <strong>{currentEnquiry?.customerName || "selected"}</strong> Enquiry?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete} variant="contained" color="primary">
            Yes
          </Button>
          <Button
            onClick={closeDeleteConfirm}
            variant="contained"
            color="error"
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EnquiryDashboard;
