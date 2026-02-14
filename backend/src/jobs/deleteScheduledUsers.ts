import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import Notification from '../models/Notification.js';

export const deleteScheduledUsers = async () => {
  try {
    const now = new Date();
    const usersToDelete = await User.find({
      deletionScheduledAt: { $lte: now }
    });

    for (const user of usersToDelete) {
      await Post.deleteMany({ user: user._id });
      await Comment.deleteMany({ user: user._id });
      await Notification.deleteMany({ user: user._id });
      await User.findByIdAndDelete(user._id);
      console.log(`Deleted user: ${user.email}`);
    }
  } catch (error) {
    console.error('Error deleting scheduled users:', error);
  }
};

setInterval(deleteScheduledUsers, 24 * 60 * 60 * 1000);
