import { activityLogs } from '../../mock/mockData.js';

function NotificationCenter() {

  return (
    <div>

      <h2>Notifications</h2>

      {activityLogs.map(log => (
        <div key={log.id}>
          {log.action}
        </div>
      ))}

    </div>
  );
}

export default NotificationCenter;