const Profile = require('../models/Profile');
const User = require('../models/User');

const handleCreateProfile = async (req, res) => {
  const userId = req.user._id; // Get userId from authenticated request
  const { name, address, phone, dob } = req.body;
  if ( !userId || !name || !address || !phone || !dob ) {
    return res.status(400).json({ error: 'need userID, name, address, phone, dob u dumbass' });
  }
  try {
    // Check if profile already exists for the user
    const existingProfile = await Profile.findOne({ userId });
    if (existingProfile) {
      return res.status(400).json({ error: 'Profile already exists for this user' });
    }
    // Create new profile
    const newProfile = await Profile.create({ userId, name, address, phone, dob });
    await newProfile.save(); // Save the profile to the database
    res.status(201).json({ message: 'Profile created', username: name });
    console.log(`Profile for user ${userId} created successfully`);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
    console.error('Profile creation error:', err);
  }
}

const handleGetProfile = async (req, res) => {
  const userId = req.user.userId; // Get userId from authenticated request
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  try {
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    // get user email from User model
    const user = await User.findById(userId);
    // add email to response but not to profile
    const profileWithEmail = { ...profile.toObject(), email: user.email };
    if (profileWithEmail.profilePicture?.data) {
      profileWithEmail.profilePicture.data = profileWithEmail.profilePicture.data.toString('base64');
    }
    res.json(profileWithEmail);
    console.log(`Profile for user ${userId} fetched successfully`);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
    console.error('Error fetching profile:', err);
  }
}

const handleUpdateProfile = async (req, res) => {
  const userId = req.user.userId; // Get userId from authenticated request
  const { name, address, phone, dob } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  try {
    const profile = await Profile.findOneAndUpdate(
      { userId },
      { name, address, phone, dob },
      { new: true } // Return the updated profile
    );
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json({ message: 'Profile updated', profile });
    console.log(`Profile for user ${userId} updated successfully`);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
    console.error('Error updating profile:', err);
  }
}

const handleDeleteProfile = async (req, res) => {
  const userId = req.user.userId; // Get userId from authenticated request
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  try {
    const profile = await Profile.findOneAndDelete({ userId });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json({ message: 'Profile deleted' });
    console.log(`Profile for user ${userId} deleted successfully`);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
    console.error('Error deleting profile:', err);
  }
}

const handleAddProfilePicture = async (req, res) => {
  const userId = req.user.userId; // Get userId from authenticated request

  if (!userId || !req.file) {
    return res.status(400).json({ error: 'User ID and profile picture are required' });
  }
  try {
    const profile = await Profile.findOneAndUpdate(
      { userId },
    {
        profilePicture: {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        } 
      },
      { new: true } // Return the updated profile
    );
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json({ message: 'Profile picture updated', profile });
    console.log(`Profile picture for user ${userId} updated successfully`);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
    console.error('Error updating profile picture:', err);
  }
}

module.exports = { handleCreateProfile, handleGetProfile, handleUpdateProfile, handleDeleteProfile, 
  handleAddProfilePicture };
