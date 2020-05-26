import { format, startOfHour, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';
import User from '../models/User';

import CreateNotificationService from '../services/CreateNotificationService';

export default async (req, res, next) => {
  res.on('finish', async () => {
    const { provider_id, date } = req.body;

    /**
     * Check for past dates
     */
    const hourStart = startOfHour(parseISO(date));

    /**
     * Notify appointment provider
     */
    const user = await User.findByPk(provider_id);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      {
        locale: pt,
      }
    );

    const notification = await CreateNotificationService.run(
      `Novo agendamento de ${user.name} para ${formattedDate}.`,
      provider_id
    );

    const ownerSocket = req.connectedUsers[provider_id];

    if (ownerSocket) {
      req.io.to(ownerSocket).emit('notification', notification);
    }
  });

  next();
};
