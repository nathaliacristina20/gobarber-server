import Notification from '../schemas/Notification';

class CreateNotificationService {
  async run(content, userId) {
    const notification = await Notification.create({
      content,
      user: userId,
    });

    return notification;
  }
}

export default new CreateNotificationService();
